module.exports = { 
  createAcc:function(req,res,con,callback){
  if(req.body.secret =='chicken'){
    con.query("SELECT username FROM user WHERE username = '"+req.body.username+"'",function(err,result,fields){
      if(err) throw err;
      if(result.length <=0){
        con.query("INSERT INTO user (user_id,username,password) VALUES (null,'"+req.body.username+"', '"+req.body.password+"' )" ,function (err, result) {
          info='';
	  if(err) throw err;
       	  callback('Account Created Successfully');
          console.log('A new user has created an account');
	  return 1;   
        });
     }
      else{
        info = "Username Already In Use";
        res.render('./pugFiles/createAcc',{test:info} );
      }
    });
  }
  else{
    info = "Secret Code is Incorrect";
    res.render('./pugFiles/createAcc',{test:info} );
  }
  }
};
