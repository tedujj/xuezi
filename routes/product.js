const express=require('express');
const pool=require('../pool.js');
var router=express.Router();
//添加路由
//1.商品列表
router.get('/list',function(req,res){
	var obj=req.query;
	var pno=obj.pno;
	var size=obj.size;
	if (!pno) pno=1;
	if (!size) size=9;
	pno=parseInt(pno);
	size=parseInt(size);
	var start=(pno-1)*size;
	pool.query('SELECT lid ,price,title FROM xz_laptop LIMIT ?,?',[start,size],function(err,result){
	 if(err) throw err;
	 res.send(result);
	});
});
//2.商品详情
router.get('/detail',function(req,res){
  var obj=req.query;
  if (!obj.uid)
  {
	  res.send({code:401,msg:'uid required'});
	  return;
  }
  pool.query('SELECT * FROM xz_laptop WHERE lid=?',[obj.uid],function(err,result){
    if(err) throw err;
	res.send(result);
   });
});
//3.商品添加
  router.post('/add',function(req,res){
    var obj=req.body;
	var i=401;
	for (var key in obj)
	{
		i++;
       if (!obj[key])
       { 
		   res.send({code:i,msg:key+'required'});
		   return;
       }
	}
	pool.query('INSERT INTO xz_laptop SET ?',[obj],function(err,result){
	  if(err) throw err;
	  
	  if (result.affectedRows>0)
	  {
		  res.send({code:200,msg:'add suc'});
	  }else{
	      res.send({code:301,msg:'add err'});
	  }
	});
  });
//4.商品删除
router.get('/delete',function(req,res){
  var obj=req.query;
  if(!obj.lid){
	res.send({code:401,msg:'lid required'});
	return;
  }
  pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
  if(err) throw err;
  if(result.affectedRows>0){
   res.send({code:200,msg:'delete suc'});
  }else{
   res.send({code:301,msg:'delete err'});
  }
  });
});
//5.商品修改
router.get('/update',function(req,res){
	var obj=req.query;
	var i=400;
	for(var key in obj){
		i++;
        if(!obj[key]){
		 res.send({code:i,msg:key+'required'});
		 return;
		}
	}
	pool.query('UPDATE xz_laptop ? SET WHERE lid=?',[obj,obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectesRows>0){
			res.send({code:200,msg:'update suc'})
		}else{
			res.send({code:301,msg:'update err'});	
		}
	});
});


//导出路由器对象
module.exports=router;