#!/usr/bin/env node

var mysql = require('mysql');
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require('fs');
//var key = fs.readFileSync('encryption/private.key');
//var cert = fs.readFileSync( 'encryption/kweb.crt' );
//var ca = fs.readFileSync( 'encryption/kweb.crt' );
//var options = {
//	key: key,
//	cert: cert,
//	ca: ca
//	};
app.set('view engine', 'pug');
//const server = app.listen(80, () => {
 // console.log(`Express running → PORT ${server.address().port}`);
//});

var con = mysql.createConnection({
  host: "localhost",
  user: "kweb",
  password: "password",
  database: "mydb"
});

app.get('/', (req, res) => {
	console.log("test");
	res.render('index');
});

app.post('/login', function(req, res) {	
  	
  	con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
	if(result.length>0){
    	
   	var sqlResult = result[0].password;


	if(req.body.password==sqlResult){res.send('itworked');}
	 
  
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
var https = require('https');
https.createServer({
  key: fs.readFileSync('encryption/server.key'),
  cert: fs.readFileSync('encryption/server.cert')
}, app).listen(443, () => {
  console.log('Listening...')
})


