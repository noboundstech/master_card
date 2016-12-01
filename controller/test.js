var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();

/*
router.route('/ayan')
.get(function (req, res) {

var db_ayan = require('db_query/query')
var data ={};
//db_ayan.selectFromDb(req,res,'userId=2','*','tUserMater',data,function(){	
db_ayan.searchByMerchant(req,res,'mem.memberWechatId=\'w1\'','top 10 mm.merchantId','',data,function(){

	res.json({ message: data });
})



})

router.route('/ayan1')
.get(function (req, res) {

var db_ayan = require('db_query/query')
var data ={};
//db_ayan.selectFromDb(req,res,'userId=2','*','tUserMater',data,function(){	
db_ayan.searchByDistance(req,res,'mem.memberWechatId=\'w1\'','top 10 mm.merchantId','',data,function(){

	res.json({ message: data });
})



})

router.route('/custprofile')
.get(function (req, res) {

var db_ayan = require('db_query/query')
var data ={};
//db_ayan.selectFromDb(req,res,'userId=2','*','tUserMater',data,function(){	
db_ayan.customerProfile(req,res,'mem.memberWechatId=\'w1\'','top 10 mm.merchantId','',data,function(){

	res.json({ message: data });
})



})

router.route('/custtag')
.get(function (req, res) {

var db_ayan = require('db_query/query')
var data ={};
//db_ayan.selectFromDb(req,res,'userId=2','*','tUserMater',data,function(){	
db_ayan.customerTag(req,res,'mem.memberWechatId=\'w1\'','top 10 mm.merchantId','',data,function(){

	res.json({ message: data });
})


})
*/

router.route('/fetchprofile')
.get(function (req, res) {

	var wechatId = req.query.id;

//res.send('id : '+wechatId)
var db_ayan = require('db_query/query')
var data ={};
db_ayan.customerProfileTest(req,res,wechatId,'','',data,function(){

	res.json({ message: data });
})

})

router.route('/fetchtag')
.get(function (req, res) {

	var wechatId = req.query.id;
	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.fetchTagTest(req,res,wechatId,'','',data,function(){

	res.json({ message: data });
})

})

router.route('/addtag')
.get(function (req, res) {

	var wechatId = req.query.id;
	var tag = req.query.tag;
	var csrid = req.query.csrid;

	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.addTagTest(req,res,wechatId,tag,csrid,data,function(){

	res.json({ message: data });
})

})

router.route('/fetchalltag')
.get(function (req, res) {

	
	var tag = req.query.tag;

	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.fetchalltagTest(req,res,tag,data,function(){

	res.json({ message: data });
})

})

router.route('/searchbypart')
.get(function (req, res) {

	
	var tag = req.query.tag;

	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.searchByPartialNameTest(req,res,tag,data,function(){

	res.json({ message: data });
})

})


router.route('/searchbymerchant')
.get(function (req, res) {

	
	var wechatId = req.query.id;

	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.searchByMerchantTest(req,res,wechatId,data,function(){

	res.json({ message: data });
})

})

router.route('/searchbydistance')
.get(function (req, res) {

	
	var lat = req.query.lat;
	var lon = req.query.lon;

	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.searchByDistanceTest(req,res,lat,lon,data,function(){

	res.json({ message: data });
})

})

router.route('/fetchofferhistory')
.get(function (req, res) {

	
	var id = req.query.id;
	
	var db_ayan = require('db_query/query')
	var data ={};

db_ayan.fetchOfferHistoryTest(req,res,id,data,function(){

	res.json({ message: data });
})

})

module.exports = router;