#!/usr/bin/env node
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
const server = app.listen(80, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/', (req, res) => {
	console.log("test");
	res.render('index');
  });
pp.post('/api/users', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    

    res.send(username + ' ' + password );
});
