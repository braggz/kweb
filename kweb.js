#!/usr/bin/env node
var keygen=require("keygenerator");
var mysql = require('mysql');   // All the Dependencies the program needs
var express = require('express');
var ejs= require('ejs');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var fs = require('fs');
var formidable = require('formidable');
var key = fs.readFileSync('encryption/server.key'); //were the https key is located
var cert = fs.readFileSync( 'encryption/server.cert' );//Where the server certificate is located
const https = require('https');
var download = require('download-file');
const multer = require('multer');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());     //Setting up the bodyparser and cookie parser to be used
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'))
var fileName="test";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('/var/www/Kweb/uploads/'+req.cookies.userName)){
        console.log('dir created');
    fs.mkdirSync('/var/www/Kweb/uploads/'+req.cookies.userName);
}
        cb(null, '/var/www/Kweb/uploads/'+req.cookies.userName)
  },
  filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        fileName=req.cookies.userName+'.'+Date.now()+'.'+extension;
        cb(null, req.cookies.userName+'.'+Date.now()+'.'+extension)
        }
})
var upload = multer({ storage: storage })

var options = {		//Creates json object to store information about the https files
	key: key,
	cert: cert,
      
};
const server = app.listen(80, () => { //Starts the http server
	console.log('Http Connection');
});

https.createServer({key,cert}, app).listen(443, () => { //Starts the https server
	console.log('Https Connection')
})

var con = mysql.createConnection({ // Connects to the mySQL server, the password for this one is changed for protection
	host: "localhost",
  	user: "kweb",
  	password: "password",
  	database: "mydb"
});

app.get('/', (req, res) => {
	
	if(req.secure){ 
		con.query("SELECT * FROM user WHERE username='"+req.cookies.userName+"'",function(err,result,fields){ // Here i am using cookies to greet the user when they have logged in in the past
			if(result.length>0){
				res.render('index',{test:'Welcome Back '+req.cookies.userName});
			}
			else{res.render('index');}		 	
		});
	}
	else{
		res.redirect('https://' + req.headers.host + req.url);
	} //redirects the user to https if the user connects with http
	
});

app.post('/login', function(req, res) {	//Checks the sql database to see if a users username and password is legitamate
  	con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
		if(result.length>0){
    			var sqlResult = result[0].password; 
			if(req.body.password==sqlResult){
				res.cookie("userName",req.body.username);//Adds a cookies to the users pc if they login successfully 
					con.query("SELECT isAdmin FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
						con.query("SELECT cName FROM file WHERE username ='" +req.body.username+"'", function (err, result, fields) {
							if(result.length != null){
								res.render('./pugFiles/loginSuc',{fileNames:result})
							}
							else{ res.render('./pugFiles/loginSuc',{fileNames:0})}
							});
					});
			}
			else{
				res.render('index', {test:'Bad Password'});
			} 
  
		}
		else{
			res.render('index',{test:'bad username'});
		}	
	});
 });

app.post('/createAcc', function(req,res){
	var file = __dirname + '//keith.txt';	
 	res.download('/var/www/Kweb/keith.txt');
	res.render('./pugFiles/createAcc');
	
});

app.post('/newAcc', function(req,res){//The page for users to create an account
	if(req.body.secret =='chicken'){
  		con.query("SELECT username FROM user WHERE username = '"+req.body.username+"'",function(err,result,fields){
			if(result.length <=0){
				con.query("INSERT INTO user (user_id,username,password) VALUES (null,'"+req.body.username+"', '"+req.body.password+"' )" ,function (err, result) {
   					console.log("1 record inserted");
					res.render('index',{test:'Account Created'});
				});
	
			}
			else{
				res.render('./pugFiles/createAcc', {test:'Username Already Used'});
			}

		});
	}
	else{
			res.render('./pugFiles/createAcc', {test:'Secret Code is Incorrect'});
	}

});

app.post('/catPics',function(req,res){
	var test;
	for(var i=0; i<5;i++){
		test.push('test.jpg');
	}	
	res.render('pugFiles/catPics.pug',{test:test});			
});

app.get('/downloadFile', (req, res) => {
	con.query("SELECT path,name FROM file WHERE cName = '"+req.query.downloadBut+"'",function(err,result,fields){
		path = result[0].path;
		name = result[0].name; 
		res.download(path+'/'+name);	
        	});
});

app.get('/deleteFile',(req,res) => {
	con.query("SELECT path,name FROM file WHERE cName = '"+req.query.delBut+"'",function(err,result,fields){
		console.log(result[0].path+'/'+result[0].name);
		fs.unlink(result[0].path+'/'+result[0].name,function(err){
		console.log('File Deleted');
		});		
	});
	con.query("DELETE FROM file WHERE cName = '"+req.query.delBut+"'",function(err,result,fields){	
		res.redirect('/');
	});
});
	
app.post('/admin', upload.single('theFile'), (req, res) => {
	
	con.query("INSERT INTO file (username,name,path,cName) VALUES ('"+req.cookies.userName+"', '"+fileName+"','/var/www/Kweb/uploads/"+req.cookies.userName+"','"+req.body.fileName+"')" ,function (err, result) {
		if(err){console.log(err);}	
		console.log('file logged');
});
	res.redirect('/');
});
