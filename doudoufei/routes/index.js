var express = require('express');
var router = express.Router();
var UserModel = require("../model/User");
var GoodsModel = require("../model/Goods");
var md5 = require("md5");
var multiparty = require("multiparty");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.get('/shop', function(req, res, next) {
  res.render('shop', {});
});

router.get('/add_goods', function(req, res, next) {
  res.render('add_goods', {});
});


router.get('/goods', function(req, res, next) {
	var condition = req.query.condition;
	var pageNO = req.query.pageNO || 1;
	pageNO = parseInt(pageNO);
	var perPageCnt = req.query.perPageCnt || 10;
	perPageCnt = parseInt(perPageCnt);

	GoodsModel.count({goods_name: {$regex: condition}}, function(err, count){
		console.log("数量:" + count);
		var query = GoodsModel.find({goods_name: {$regex: condition}})
		.skip((pageNO-1)*perPageCnt).limit(perPageCnt);
		query.exec(function(err, docs){
			console.log(err, docs);
			var result = {
				total: count,
				data: docs,
				pageNO: pageNO
			}
			res.json(result);
		});
	})
	
})

// router.get('/goods', function(req, res, next) {
//   var condition = req.query.condition          //模糊查询的商品名
//   var pagenum = parseInt(req.query.pagenum)    //当前页码数
//   var listnum = parseInt(req.query.listnum)    //一页显示多少商品
//   //count 查询的一共有多少个商品，数量
//   GoodsModel.count({goodsname:{$regex:condition}},function(err,count){
//     // console.log(count)
//     //数据库中模糊查找到的商品，   skip以后是分页显示 
//     var query = GoodsModel.find({goodsname:{$regex:condition}}).skip((pagenum-1)*listnum).limit(listnum)
//     //拿到值向前端发送
//     query.exec(function(err,doce){
//       console.log(doce.length)
//       //状态码和发送的内容
//       var result={
//         code:1,
//         zong:count,
//         data:doce,
//         pagenum:pagenum,
//       }  
//       //判断是否有数据  
//       if(doce.length>0){
//         res.json(result)
//         return
//       }else{
//         result.code=0;
//         res.json(result)
//         res.end()
//       }
//     })
//   })
// });

router.get('/add_goods2', function(req, res, next) {
  res.render('add_goods2', {});
});

router.post('/api/goods_upload', function(req, res, next) {
	var form = new multiparty.Form({
		uploadDir: "public/images"
	});
	var result = {
		code: 1,
		message: "商品信息保存成功"
	};
	form.parse(req, function(err, body, files){
		if(err) {
			console.log(err);
		}
		console.log(body);
		var goods_name = body.goods_name[0];
		var price = body.price[0];
		var goods_sn = body.goods_sn[0];
		var virtual_sales = body.virtual_sales[0];
		var imgPath = files["img"][0].path.replace("public\\", "");
		var gm = new GoodsModel();
		gm.goods_name = goods_name;
		gm.goods_sn = goods_sn;
		gm.virtual_sales = virtual_sales;
		gm.price = price;
		gm.imgPath = imgPath;
		gm.save(function(err){
			if(err) {
				result.code = -99;
				result.message = "商品保存失败";
			}
			res.json(result);
		})
	})
});

router.get("/loginAction", function(req, res) {
	if(req.query.username == "admin" && req.query.psw == "h5h5h5h5") {
		res.send("登录成功");
	} else {
		res.send("登录失败");
	}
})

module.exports = router;
