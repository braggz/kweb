module.exports = {
  index:function(req,res,con,indexInfo){
    if(req.secure){
        
        
	res.render('index',{indexInfo:indexInfo});
      
	
    }
        
    else{
      res.redirect('https://' + req.headers.host + req.url);
    } //redirects the user to https if the user connects with http
  }
};
