var mysql = require('mysql');
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var JSAlert = require("js-alert");

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

app.get('/', (req, res) => {
	console.log("test");
	res.render('index');
});

app.post('/login', function(req, res) {	
  	
  	con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
	if(result.length>0){
    	
   	var sqlResult = result[0].password;


	if(req.body.password==sqlResult){res.send('itworked');}
	else{res.send('failed');} 
  }
	else{res.send('user does not exist');}
});
	   
});
app.post('/createAcc', function(req,res){
	res.render('./pugFiles/createAcc');
	JSAlert.alert("Your files have been saved successfully.", "Files Saved", "Got it");	


});
app.post('/newAcc', function(req,res){
		if(req.body.secret =='chicken'){
  	con.query("INSERT INTO user (user_id,username,password) VALUES (null,'"+req.body.username+"', '"+req.body.password+"' )" ,function (err, result) {
    //	if (err) throw err;
    	console.log("1 record inserted");
	
	res.render('index');


});
}
	else{res.send('Bad secret code');}
});
