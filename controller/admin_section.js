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
router.route('/addNewUser')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.ValidateAddUser(req,res,function(){
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback){
			var	selection 	= '*',
				table    	= constant.USER_MASTER_TABLE;
			var condition   = [{
								"name" 	: "userName",
								"type"	: constant.VARCHAR50,
								"value"	: req.body.add_user_name
							}];
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				if(response_data.details.length>0)
				{
					response_data.success = false;
					response_data.message = "User Name Already Exist.";
					res.status(203).send({response_data});
				}
				else
				{
					callback();
				}
			})
		},
		function(callback)
		{
			var table   = constant.USER_MASTER_TABLE;
			 fieldlist  = [{
							"name" 		: "userName",
							"type"		: constant.VARCHAR50,
							"varname" 	: "user_name",
							"value"		: req.body.add_user_name
						},{
							"name" 		: "userPwd",
						    "type"		: constant.VARCHAR50,
						    "varname" 	: "user_password",
							"value"		: req.body.add_user_name
						},{
							"name" 		: "userRole",
						    "type"		: constant.VARCHAR5,
						    "varname" 	: "user_role",
							"value"		: req.body.user_role
						},{
							"name" 		: "UserActiveStatus",
						    "type"		: constant.VARCHAR1,
						    "varname" 	: "active_status",
							"value"		: "Y"
						}];
	    	condition   = '';
		 
	    	db_query.insertToDb(req,res,condition,fieldlist,table,response_data,function(){
	    		callback();
	    	});
	}],function(err) {
		response_data.success = true;
		response_data.message = "User Added Successfully.!";
		res.status(200).send({response_data});
	});
});
router.route('/updateUserDetails')
.post(function (req, res) {
	var async 		= require('async');
	var utils   	= require('utility/utils'),
	 	db_query 	= require('db_query/query'),
		constant 	= require("config/constant");
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.ValidateUpdateUser(req,res,function(){
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback){
			var	selection 	= '*',
				table    	= constant.USER_MASTER_TABLE;
			var condition   = [{
								"name" 	: "userName",
								"type"	: constant.VARCHAR50,
								"value"	: req.body.userName
							}];
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				console.log(response_data.details);
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "User does not exist.";
					res.status(203).send({response_data});
				}
				
			})
		},
		function(callback)
		{
			var table   = constant.USER_MASTER_TABLE;
			var fieldlist  = [{
							"name" 		: "userPwd",
						    "type"		: constant.VARCHAR50,
						    "varname" 	: "user_password",
							"value"		: req.body.userPwd
						},{
							"name" 		: "userRole",
						    "type"		: constant.VARCHAR5,
						    "varname" 	: "user_role",
							"value"		: req.body.userRole
						},{
							"name" 		: "UserActiveStatus",
						    "type"		: constant.VARCHAR1,
						    "varname" 	: "active_status",
							"value"		: req.body.UserActiveStatus
						}];
		 	var condition   = [{
								"name" 	: "userId",
								"type"	: constant.SMINT,
								"value"	: req.body.userId
							}];
	    	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
	    		callback();
	    	});
	}],function(err) {
		response_data.success = true;
		response_data.message = "User Updated Successfully.!";
		res.status(200).send({response_data});
	});
});
module.exports = router;