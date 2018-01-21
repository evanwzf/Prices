var express = require('express');
var router = express.Router();
var GoodsModel = require("../model/Goods");

router.get('/add', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', function(req, res, next) {
	var condition = req.query.condition;
	// 注意代码的健壮性
	// 测试中，有异常系测试。 后端最头疼的是异常系测试。
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
});

module.exports = router;
