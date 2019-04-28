#!/usr/bin/env node

var mysql = require('mysql');
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require('fs');
var key = fs.readFileSync('encryption/server.key');
var cert = fs.readFileSync( 'encryption/server.cert' );
app.use(cookieParser());
var options = {
      key: key,
      cert: cert,
      
      };
const https = require('https')
app.set('view engine', 'pug');
const server = app.listen(80, () => {
 console.log(`Express running → PORT ${server.address().port}`);
});

var con = mysql.createConnection({
  host: "localhost",
  user: "kweb",
  password: "password",
  database: "mydb"
});
https.createServer({key,cert}, app).listen(443, () => {
  console.log('Listening...')
})
app.get('/', (req, res) => {
	if(req.secure){
		
	con.query("SELECT * FROM user WHERE username='"+req.cookies.userName+"'",function(err,result,fields){
	console.log(result + " " + req.cookies.userName);
	if(result.length>0){res.render('index',{test:'Welcome Back '+req.cookies.userName});}
	else{res.render('index');} 	
	});
	}
	else{res.redirect('https://' + req.headers.host + req.url);}
});

app.post('/login', function(req, res) {	
  	
  	con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
	if(result.length>0){
    	
   	var sqlResult = result[0].password;


	if(req.body.password==sqlResult){
	let users = {user:'test'}
	res.cookie("userName",req.body.username);
	console.log(req.cookies);
	res.render('./pugFiles/loginSuc');
	
	;}
	else{res.render('index', {test:'Bad Password'});} 
  
}	else{res.render('index',{test:'bad username'});}

});
	   
});
app.post('/createAcc', function(req,res){
	res.render('./pugFiles/createAcc');
	


});
app.post('/newAcc', function(req,res){
		if(req.body.secret =='chicken'){
  


	con.query("SELECT username FROM user WHERE username = '"+req.body.username+"'",function(err,result,fields){
	if(result.length <=0){

	con.query("INSERT INTO user (user_id,username,password) VALUES (null,'"+req.body.username+"', '"+req.body.password+"' )" ,function (err, result) {
    //	if (err) throw err;
    	console.log("1 record inserted");
		
	res.render('index',{
	test:'Account Created'}
	);


});	
}else{res.render('./pugFiles/createAcc', {test:'Username Already Used'});}

});
}	else{res.render('./pugFiles/createAcc', {test:'Secret Code is Incorrect'});}

});

	app.post('/catPics',function(req,res){
	res.render('./pugFiles/catPics');
});
