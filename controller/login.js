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
.get(function (req, res) {
	req.body 		= req.query;
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var response_data = {};
	
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validateSignin(req,res,function(){
				callback();
			})
		},
		function(callback){
			var crypto 	 	= require('crypto'),
				userName 	= req.body.username,
				
				password 	= req.body.password;
			var	selection 	= '*',
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
					if(response_data.details[0].UserActiveStatus == constant.ACTIVE_STATUS)
					{
						response_data.user_details =  response_data.details;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "Please Enter active Username and Password.";
						res.status(203).send({response_data});
					}
				}
				else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Username and Password.";
					res.status(203).send({response_data});
				}
			})
		},
		function(callback)
		{
			utils.createAuthentication(res,res,response_data.details[0],function(token){
				response_data.token = token;
				callback();
			})
		},
		function(callback)
		{
			var table     = constant.USER_MASTER_TABLE;
			var fieldlist   = [
				 {
					"name" 	: "userLastLogin",
				    "type"	: constant.DATE_TIME,
				    "varname" : "SYSDATETIME()",
					"value"	: null
			 	}];
			var condition   = [{
					"name" 	: "userId",
					"type"	: constant.SMINT,
					"value"	: response_data.details[0].userId
				}];
	    	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
	    		callback();
	    	});
		}

		],function(err) {
			response_data.success = true;
			response_data.message = "successfully login!";
			res.status(200).send({response_data});
		});
	});
router.route('/forget_password')
.get(function (req, res) {
	req.body 		= req.query;
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validateForgetPassword(req,res,function(){
				callback();
			})
		},
		function(callback){
			var userName 	= req.body.email;
			var	selection 	= '*',
				table    	= constant.USER_MASTER_TABLE;
			var condition   = [{
								"name" 	: "userEMailId",
								"type"	: constant.VARCHAR100,
								"value"	: userName
							}];
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				if(response_data.details.length>0)
				{
					if(response_data.details[0].UserActiveStatus == constant.ACTIVE_STATUS)
					{
						response_data.user_details =  response_data.details;
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "Please Enter active User Email Id.";
						res.status(203).send({response_data});
					}
				}
				else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Email Id.";
					res.status(203).send({response_data});
				}
			})
		},
		function(callback)
		{
			var content = require('content/email_content');
			var email_contains = content.forget_password(response_data.details[0]);
			var send_email = require('utility/email');
			send_email.send_mail(req.body.email,email_contains.subject,email_contains.body);
			callback();
		}

		],function(err) {
			response_data.success = true;
			response_data.message = "Your email and password had being send to you register email account.!";
			res.status(200).send({response_data});
		});
	});
module.exports = router;