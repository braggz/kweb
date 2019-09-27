#!/usr/bin/env node

//Dependencies
var express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
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
var login = require('./login.js');
var createAcc = require('./create_acc.js');
var newOrder = require('./new_order.js');
startServer.startServer(app);//Starts the server with a seperate function
var con = startSql.startSql();//Connects to the sql server
var orders = require('./orders.js');
var indexInfo;//The variable that stores text to display on index screen
var displayCookie=false;

app.get('/', (req, res) => {
   if(!displayCookie && req.cookies['username']){indexInfo='Welcome Back '+req.cookies['username'];}
   else if (!displayCookie){indexInfo='';}
   index.index(req,res,con,indexInfo);
   displayCookie=false;
 });

app.post('/login', function(req, res) {	//Checks the sql database to see if a users username and password is legitamate
  login.login(req,res,con, function(result){
    indexInfo = result;
    displayCookie=true;
    res.redirect('/');
  });
});

app.get('/createAcc', function(req,res){//Renders the Create Account Screen
  res.render('./pugFiles/createAcc');
});

app.post('/createAcc', function(req,res){//Chechs that a user properly fills out forms and then inserts it into the database
  createAcc.createAcc(req,res,con, function(result){
	indexInfo=result;
        displayCookie=true;	
	res.redirect('/');	
  });
});

app.post('/orders', function(req,res){
  orders.orders(req,res,con);  

});
app.post('/newOrder', function(req,res){
  newOrder.newOrder(req,res,con);  

});

app.get('/newOrder', function(req,res){
  res.render('/newOrder'); 

});
