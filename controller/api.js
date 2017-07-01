var express = require('express'),
	jwt 	= require('jsonwebtoken'),
	config  = require('config/config'),
    router  = express.Router();
//    _       = require('underscore');
require('rootpath')();
router.route('/')
.get(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found" );
})
.post(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found");
});
// api to send details of customer
router.route('/getCustomerDetails')
.post(function (req, res) {
 
	// was post method
	//req.body 			= req.query;
	
	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var utils 			= require('utility/utils');
	var response_data 	= {};
	var where_cond 		= '';
	//where_cond =  " mem.memberWechatId='KFY4269TT'";
	async.series([
		function(callback) {
			// validating the customer details
			var validate = require('utility/validate');
			validate.validateCustomer(req,res,function(){
				
				if(req.body.search_by =='customer_id')
				{
					where_cond =  " mem.memberWechatId='"+utils.mssql_real_escape_string(req.body.wechat_id)+"'";
				}
				else
				{
					where_cond =  " mem.MTRCardNumber='"+utils.mssql_real_escape_string(req.body.card_no)+"'";
				}
			
			
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
			utils.checkAuthentication(req,res,function(){
			//	console.log("authenticate");
				callback();
			})
		},
		function(callback) {
			var query = " select *";
				query+= " FROM "+constant.MEMBER_MASTER_TABLE+" as mem";
				query+= " where "+where_cond;
			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				console.log(response_data);
				if(response_data.details.length>0)
				{
					response_data.member_details = response_data.details;
					callback();
				}
				else
				{
					
					if(req.body.search_by == 'customer_id')
					{
						response_data.message = "Please Enter valid customer Wechat Id";
					}
					else
					{
						response_data.message = "Please Enter valid customer Card no.";
					}
				
					response_data.success = false;
					
					res.status(203).send({response_data});
				}
			})
		},function(callback){
			var wechat_id = req.body.wechat_id;
			var query = " SELECT mem.memberWechatId,mem.memberFirstName,";
				query += "mem.memberLastName,mem.memberGender,mem.preferredLanguage,";
				query += " mem.MTRPoints,mem.MTRCardType,mem.memberPhone,mem.memberAge,mem.memberOccupation,";
				query += "mem.memberHobby,mem.memberInfo1,mem.memberInfo2,mem.memberInfo3,mem.AddressLatitude,mem.Addresslongitude,";
				query += "mem.AddressLine1,mem.AddressLine2,mem.City,mem.District,mem.Province,mem.Country,mem.memberSegment,";
				query += "count(offer.offerClicked) as click,count(offer.offerUsed) as used, count(offer.offerSentTimestamp) as sent";
				query+= " FROM "+constant.MEMBER_MASTER_TABLE+" as mem LEFT JOIN "+constant.OFFER_RESPONSE_TABLE+" as offer ON mem.memberId = offer.memberId ";
				//query+= " LEFT JOIN  "+constant.MEMBER_TAG_TABLE+"  as tag ON mem.memberId = tag.memberId";
				query+= " WHERE "+where_cond;
				query+= " GROUP BY mem.memberWechatId,mem.memberFirstName,mem.memberLastName,mem.memberGender,mem.preferredLanguage,mem.MTRPoints,mem.MTRCardType,mem.memberPhone,mem.memberAge,mem.memberOccupation,mem.memberHobby,mem.memberInfo1,mem.memberInfo2,mem.memberInfo3,mem.AddressLatitude,mem.Addresslongitude,mem.AddressLine1,mem.AddressLine2,mem.City,mem.District,mem.Province,mem.Country,mem.memberSegment ";
			//response_data.query = query;
			//console.log(query);
			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				console.log(response_data);
				if(response_data.details.length>0)
				{
					response_data.customer_details = response_data.details;
					callback();
				}
				else
				{
					response_data.success = false;
					if(req.body.search_by == 'customer_id')
					{
						response_data.message = "Please Enter valid customer Wechat Id";
					}
					else
					{
						response_data.message = "Please Enter valid customer Card no.";
					}
					res.status(203).send({response_data});
				}
			})
		},
		function(callback){
			//	console.log("get offer details");
           		utils.getOfferDetailsList(req,res,constant,where_cond,db_query,response_data,function(){
			//	console.log(response_data);
					callback();

				})
        },
        function(callback)
        {

        	var sqlQuery = 'SELECT l.city, COUNT(*) visit';
        	 	sqlQuery += ' FROM tLocationMaster l JOIN tMemberLocationHistory h';
 				sqlQuery += ' ON l.LocationId = h.LocationId'
 				sqlQuery += ' WHERE h.memberId = '+response_data.member_details[0].memberId;
 				sqlQuery += ' GROUP BY l.city';
 			var loactionHistory = {};
 			db_query.RunSelSqlFromDb(req,res,sqlQuery,loactionHistory,function(){
 				response_data.locationHistory =  loactionHistory.details;
				callback();
			});
        }],function(err) {
			response_data.user_details = req.decoded;
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
// api to read all previous winner ticket from text file 
router.route('/getMerchantOffer')
.post(function (req, res) {
	// was post method
	//req.body 		= req.query;

	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var utils 			= require('utility/utils');
	var response_data 	= {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.MerchantOffer(req,res,function(){
				callback();
			})
		},
		function(callback){
			
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback) {
			var merchant_id 	= req.body.merchant_id;
			var query 			= " select mem.offerId, mem.offer_rule_en";
				query+= " FROM "+constant.OFFER_BY_MERCHANTS+" as mem";
				query+= " where mem.merchantId='"+merchant_id+"'";

			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Merchant Id.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});
// api to read all previous winner ticket from text file 
router.route('/getUserDetails')
.post(function (req, res) {
 	// was post method
	//req.body 		= req.query;

	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var response_data 	= {};
	async.series([
		function(callback){
			var utils = require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback) {
			var query = " select * ";
				query+= " FROM "+constant.USER_MASTER_TABLE;

			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Please Enter valid Merchant Id.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});

router.route('/getOfferDetails')
.get(function(req,res){
	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var utils 			= require('utility/utils');
	var response_data 	= {};
	var where_cond 		= '';

	 async.series([
        function(callback) {
        	var validate = require('utility/validate');
			validate.validateWeChatId(req,res,function(){
				callback();
			})
        },
        function(callback)
        {
        	where_cond =  " mem.memberWechatId='"+utils.mssql_real_escape_string(req.query.wechatid)+"'";
			utils.getOfferDetailsList(req,res,constant,where_cond,db_query,response_data,function(){
				delete response_data['predicted_offer'];
				if(response_data.details.length >0)
				{
					callback();
				}
				else
				{
					response_data.success = true;
		            response_data.message = "no offer available for the given member";
		            res.status(203).send({response_data});
				}
			});
		}],function(err) {
        //    response_data.details = "";
            response_data.success = true;
            response_data.message = "get offer details successfully";
            res.status(200).send({response_data});
    	});

})

router.route('/BulkInsert')
.post(function (req, res) {
 	// was post method
	//req.body 		= req.query;
	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var response_data 	= {};
	var sql = require('mssql');
	var inserted_value = '';
	var inserted_field = "(ChatStartTimestamp,ChatEndTimestamp,userId,memberId,memberLat,memberLong,memberTagAdded)";
	for(var i=0;i<req.body.details.length;i++)
	{
		var value = req.body.details[i];
	    inserted_value+="( SYSDATETIME() , SYSDATETIME() ,"+value.userId+","+value.memberId+","+value.memberLat+","+value.memberLong+","+value.memberTagAdded+")";
		if(i!=req.body.details.length-1)
		{
			inserted_value+=",";
		}
	}

	var config = require('config/db_connection');
	var connection1 = new sql.Connection(config, function(err) {
		//console.log(err);

		var request = new sql.Request(connection1); // or: var request = connection1.request();
	
		var sql_query = 'insert into '+constant.CHAT_HISTORY_HEADER+' '+inserted_field+' values '+inserted_value+'' ;
	   	request.query(sql_query).then(function(recordset) {
    		data.details = recordset;
        		callback();
    		connection1.close();
	    }).catch(function(err) {
	    	console.log(err)
	    	//res.send({data : err});
	    	connection1.close();
	        // ... query error checks 
	    });
	    
	});
});
module.exports = router;