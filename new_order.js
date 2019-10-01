var orders = require('./orders.js');
module.exports = {
  newOrder:function(req,res,con,callback){
   if(req.body.orderNumber && req.body.partNumber && req.body.priority && req.body.status1){
      con.query("INSERT INTO orders (ordernumber,partnumber,priority,status,comments) VALUES ('"+req.body.orderNumber+"','"+req.body.partNumber+"', '"+req.body.priority+"','"+req.body.status1+"' ,'"+req.body.comments+"')" ,function (err, result) {
      
      console.log('New Order Logged');
      callback(true);
      return 1; 
});
   }
   else if(!req.body.orderNumber){res.render('./pugFiles/newOrder',{info:'Order Number is required'});}
   else if(!req.body.partNumber){res.render('./pugFiles/newOrder',{info:'Part Number is required'});}
   else if(!req.body.priority){res.render('./pugFiles/newOrder',{info:'Priority is required'});}
   else if(!req.body.status1){res.render('./pugFiles/newOrder',{info:'Status is required'});}
 }
	
};
