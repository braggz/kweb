var fs = require('fs');
var key = fs.readFileSync('encryption/selfsigned.key'); //were the https key is located
var cert = fs.readFileSync( 'encryption/selfsigned.crt' );//Where the server certificate is located:
const https = require('https');


module.exports = {
  startServer:function(app){
    var options = {         //Creates json object to store information about the https files
      key: key,
      cert: cert,
    };
    const server = app.listen(80, () => { //Starts the http server
      console.log('Http Connection');
    })
    https.createServer({key,cert}, app).listen(443, () => { //Starts the https server
      console.log('Https Connection');
    })
  }
};
