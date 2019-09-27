module.exports = {
	newOrder:function(req,res,con){
con.query("INSERT INTO orders (ordernumber,partnumber,priority,status,comments) VALUES ('"+req.body.orderNumber+"','"+req.body.partNumber+"', '"+req.body.priority+"','"+req.body.status1+"' ,'"+req.body.comments+"')" ,function (err, result) {
      	
      console.log('New Order');
      res.redirect('/orders');
});

	}
	
};
