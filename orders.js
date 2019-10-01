module.exports = {
  orders:function(req,res,con){
     var orderNum=[];
     var partNum=[];
     var prior=[];
     var stat=[];
     var com=[];
     var test=[];
     con.query("SELECT  *  FROM orders ", function (err, result, fields) {
       for(var i in result){

	test[i]=result[i];
     
        orderNum[i]=result[i].ordernumber;
        partNum[i]=result[i].partnumber;
         prior[i]=result[i].priority;
         stat[i]=result[i].status;
         com[i]=result[i].comments;
       
	}
console.log(test);
//        console.log(test);
	res.render('./pugFiles/orders.pug',{orderNum:test});
              
     });
  }
	
};
