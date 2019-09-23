#!/usr/bin/env node
var keygen=require("keygenerator");
//var mysql = require('mysql');   // All the Dependencies the program needs
var express = require('express');
var ejs= require('ejs');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var formidable = require('formidable');
const multer = require('multer');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());     //Setting up the bodyparser and cookie parser to be used
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'))
//My own functions
var startServer = require('./start_server.js');
var startSql = require('./start_sql.js');
var index = require('./index.js');

startServer.startServer(app);//Starts the server with a seperate function
var con = startSql.startSql();//Connects to the sql server

app.get('/', (req, res) => {
  index.index(req,res,con); 
/*	if(req.secure){ 
		con.query("SELECT * FROM user WHERE username='"+req.cookies.userName+"'",function(err,result,fields){ // Here i am using cookies to greet the user when they have logged in in the past
			if(err) throw err;
			if(result.length>0){
				res.render('index',{test:'Welcome Back '+req.cookies.userName});
			}
			else{res.render('index');}		 	
		});
	}
	else{
		res.redirect('https://' + req.headers.host + req.url);
	} //redirects the user to https if the user connects with http
*/	
});

app.post('/login', function(req, res) {	//Checks the sql database to see if a users username and password is legitamate
  	con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
		var test=[];
		if(err) throw err;
		if(result.length>0){
    			var sqlResult = result[0].password; 
			if(req.body.password==sqlResult){
				res.cookie("userName",req.body.username);//Adds a cookies to the users pc if they login successfully 
					con.query("SELECT isAdmin FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
						if(err) throw err;
						con.query("SELECT cName FROM file WHERE username ='" +req.body.username+"'", function (err, result, fields) {
						     con.query("SELECT username FROM user ", function (err, result, fields) {	
						      for(var i in result){
							test[i] = result[i].username;
							}
							
							console.log(test);
							if(err) throw err;
							if(result.length != null){
								res.render('./pugFiles/loginSuc',{fileNames:result,test:test})
							}
							else{ res.render('./pugFiles/loginSuc',{fileNames:0,test:test})}
							});
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
	res.render('./pugFiles/createAcc');
	
});

app.post('/newAcc', function(req,res){//The page for users to create an account
	if(req.body.secret =='chicken'){
  		con.query("SELECT username FROM user WHERE username = '"+req.body.username+"'",function(err,result,fields){
			if(err) throw err;
			if(result.length <=0){
				con.query("INSERT INTO user (user_id,username,password) VALUES (null,'"+req.body.username+"', '"+req.body.password+"' )" ,function (err, result) {
   					if(err) throw err;
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

app.get('/downloadFile', (req, res) => {
	con.query("SELECT path,name FROM file WHERE cName = '"+req.query.downloadBut+"'",function(err,result,fields){
		if(err) throw err;
		path = result[0].path;
		name = result[0].name; 
		res.download(path+'/'+name);	
        	});
});

