module.exports = {
  orders:function(req,res,con){
    var test = [1,2,3,4,5,6,7,8,9,10];
    res.render("./pugFiles/orders.pug", {test:test});
  }
	
};
