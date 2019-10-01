module.exports = {
  login:function(req,res,con,callback){
    con.query("SELECT password FROM user WHERE username ='" +req.body.username+"'", function (err, result, fields) {
    var usersInDatabase=[];
    if(err) throw err;
    if(result.length>0){
      var sqlResult = result[0].password;
      if(req.body.password==sqlResult){
        res.cookie("userName",req.body.username);//Adds a cookies to the users pc if they login successfully
          con.query("SELECT username FROM user ", function (err, result, fields) {
            for(var i in result){
              usersInDatabase[i] = result[i].username;
            }
	    if(err) throw err;
            if(result.length != null){
              res.cookie('username',req.body.username);
              console.log(result);
              res.render('./pugFiles/loginSuc',{fileNames:result,test:usersInDatabase})
            }  
            else{ res.render('./pugFiles/loginSuc',{fileNames:0,test:usersInDataBase})}
          });
      }
      else{
       callback('Password Is Incorrect');
       return 0;
      }
    }
    else{
      callback('Username is Incorrect');
      return 0;
     }
    });

  }
	
};
