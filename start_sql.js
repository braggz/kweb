var mysql = require('mysql');   // All the Dependencies the program needs
module.exports = {
  startSql:function(){
    var con = mysql.createConnection({ // Connects to the mySQL server, the password for this one is changed for protection
      host: "localhost",
      user: "kweb",
      password: "password",
      database: "mydb"
    });
  console.log("Sql Connected");
  return con;
 }
};
