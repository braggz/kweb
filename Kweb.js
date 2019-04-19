#!/usr/bin/env node


const express = require('express');
const app = express();
const server = app.listen(80, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/', (req, res) => {
  res.render('index',{
	 
});
 
});
app.set('view engine', 'pug');


