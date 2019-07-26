//创建用户路由器，添加注册路由（post，/reg）导出路由器，在服务器下引入并挂载到/user   /user/reg

const express=require('express');
//引入连接池模块
const pool=require('../pool.js');//上一级目录
//创建路由器对象
var router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.1获取数据
  var obj=req.body;
  console.log(obj);
 //1.2验证数据是否为空
  if(obj.uname===''){
   res.send({code:401,msg:'uname required'});
   //阻止往回执行
   return;
  }
  if(obj.upwd===''){
   res.send({code:402,msg:'upwd required'});
   return;
  }
  if (obj.email==='')
  {
	  res.send({code:403,msg:'email required'});
	  return;
  }
  if (obj.phone==='')
  {
	  res.send({code:404,msg:'phone required'});
	  return;
  }
 //1.3执行SQl语句
  pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
    if(err) throw err;
	  console.log(result);
	if(result.affectedRows>0){
	 res.send({code:200,msg:'register suc'});
	}
  });
});

//2用户登录
router.post('/login',function(req,res){
	//2.1获取数据
   var obj2=req.body
	   //console.log(obj2);
   //2.2检测数据是否为空
  if (obj2.uname==='')
  {
	  res.send({code:401,msg:'uname required'});
	  return;
  }
  if (obj2.upwd==="")
  {
	 res.send({code:402,msg:'upwd required'});
	 return;
  }
   //2.3执行SQL语句
   //查找用户和密码同时满足的数据
   pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj2.uname,obj2.upwd],function(err,result){
     if(err) throw err
     //console.log(result);
     //判断是否登录成功
	 if (result.length>0)
	 {
		 res.send({code:200,msg:'login suc'});
	 }else{
	     res.send({code:301,msg:'login err'}); 
	 }
   });
});
  
//3检索用户
router.get('/detail',function(req,res){
 //3.1获取数据
  var obj=req.query;
  console.log(obj);
 //3.2验证是否为空
  if (!obj.uid)
  {
	  res.send({code:401,msg:'uid required'});
	  return;
  }
 //3.3执行SQL语句
  pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
	  if(err) throw err;
	  //console.log(result);
      //判断是否检索到用户，如果检索到，把该用户的对象到浏览器，否则响应检索不到
      if (result.length>0)
      {
		  res.send(result[0]);
      }else{
	     res.send({code:301,msg:'can ont found'});
	  }
  });
});
 
//4.修改用户
router.get('/update',function(req,res){
  //4.1获取数据
  var obj=req.query;
  //4.2验证是否为空
  //遍历对象，获取每个属性值
   var i=400;
   for(var key in obj){
     i++;
    //console.log(key,obj[key]);
	//如果属性值为空，则提示属性名是必须的
	if(!obj[key])
	{
      res.send({code:i,msg:key+' required'});
	  return;
	}
  }
   //4.3执行SQl语句
   pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
    if(err) throw err;
	if (result.affectedRows>0)
	{
		res.send({code:200,msg:'update suc'});
	}else{
	    res.send({code:301,msg:'update err'});
	}
	 //console.log(result);
  });
});

//5.用户列表
 router.get('/list',function(req,res){
   var obj=req.query;
   if (!obj.pno)
   {
	   obj.pno=1;
   }
   if (!obj.size)
   {
	   obj.size=3;
   }
   pno=parseInt(obj.pno);
   size=parseInt(obj.size);
   //计算开始查询的值
   var start=(obj.pno-1)*size;
   pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],function(err,result){
    if(err) throw err;
	res.send(result);
   });
 });
//6.删除用户
router.get('/delete',function(req,res){
   var obj=req.query;
   if (!obj.uid)
   {
	  res.send({code:401,msg:'uid required'})
	  return;
   }
   pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
    if(err) throw err;
    if (result.affectedRows>0)
    {
	   res.send({code:200,msg:'delete suc'});
    }else{
       res.send({code:301,msg:'delete err'});
    }
  });
});
//导出路由器对象
module.exports=router;