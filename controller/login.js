var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();
/*
router.use(function(req, res, next) {
	var utils = require('utility/utils');
	utils.authenticateUser(req,res,next);
});
*/
router.route('/')
.get(function (req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
})
.post(function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});
router.route('/login')
.post(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validateSignin(req,res,function(){
				callback();
			})
		},function(callback){
			var crypto 	 	= require('crypto'),
				userName 	= req.body.username,
				constant 	= require("config/constant"),
				password 	= req.body.password;
			var db_query 	= require('db_query/query'),
				selection 	= '*',
				table    	= constant.USER_MASTER_TABLE;
			var condition   = [{
								"name" 	: "userName",
								"type"	: constant.VARCHAR50,
								"value"	: userName
							},{
								"name" 	: "userPwd",
								"type"	: constant.VARCHAR50,
								"value"	: password
							}];
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Username and Password.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "successfully login!";
			res.status(200).send({response_data});
		});
	});
module.exports = router;