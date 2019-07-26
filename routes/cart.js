const express=require('express');
//引入连接池
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//1.添加购物车
router.get('/add',function(req,res){
	var obj=req.query;
	if(!obj.lid){
		res.send({code:401,msg:'lid required'});
		return;
	}
	if(!obj.count){
		res.send({code:402,msg:'count required'});
		return;
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_shoppingcart_item SET ?',[obj],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'add suc'})
		}else{
			res.send({code:301,msg:'add err'});	
		}
	});
});