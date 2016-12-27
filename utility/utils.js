module.exports =
{
	'createAuthentication': function(req,res,data,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		// decode token
		var token = jwt.sign(data, config.secret);
		next(token);
	
	},
	'checkAuthentication': function(req,res,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			express = require('express'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.query.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token,config.secret, function(err, decoded) {			
				if (err) {
					var response_data = {};
					return res.status(203).send({ 
						success: false,
						response_data : {
											message: 'Please provide valid token.'
										}
					});
				//	return res.json({ success: false, message: 'Failed to authenticate token.',err :err });		
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;	
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(203).send({ 
				success: false, 
				message: 'No token provided.'
			});
		}
	},
	'getTableColumnType' : function(sql,type)
	{
		var constant = require("config/constant");
		if(type == constant.VARCHAR50)
		{
			return sql.VarChar(50);
		}
		if(type == constant.VARCHAR100)
		{
			return sql.VarChar(100);
		}
		if(type == constant.VARCHAR20)
		{
			return sql.VarChar(20);
		}
		if(type == constant.VARCHAR2)
		{
			return sql.VarChar(2);
		}
		if(type == constant.VARCHAR5)
		{
			return sql.VarChar(5);
		}
		if(type == constant.VARCHAR1)
		{
			return sql.VarChar(1);
		}
		if(type == constant.INT)
		{
			return sql.Int
		}
		if(type == constant.BIT)
		{
			return sql.Bit
		}
		if(type == constant.SMINT)
		{
			return sql.SMALLINT(2);
		}
		if(type == constant.DEC_10_6)
		{
			return sql.Decimal(10, 6);
		}
		if(type == constant.DATE_TIME)
		{
			return sql.datetime;
		}
		if(type == constant.BIGINT)
        {
            return sql.bigint;
        }
        if(type == constant.VARCHAR255)
        {
            return sql.VarChar(255);
        }
	},
	'addAndUpdateTags' : function(req,res,row,response_data,callback_fun)
	{
		var constant 	= require("config/constant"),
		db_query 		= require('db_query/query'),
		len         	= req.body.tags.length;
		var action 		= [];
		var memberid    = req.body.member_id,
			  csrid     =   req.decoded.userId,
	       tagstatus    = 1,		      
		    wechatId    = req.body.id,
		    cur_date 	= null,
	          table     = constant.MEMBER_TAG_TABLE;
	    var fieldlist  	= {};
	    var condition  	= {};
		var send_data 	= {};
		var tagid  		= req.body.tags[row].tagId
			sqlstring  	= 'select count(*) tagcnt from '+constant.MEMBER_TAG_TABLE+' mt where mt.tagId='+tagid+' and mt.memberId='+memberid ;	
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				if (response_data.details[0].tagcnt > 0)
				{		
					cur_date = null;
					fieldlist   = [{
									"name" 	: "statusOfTag",
								    "type"	: constant.BIT,
								    "varname" : "tagstatus",
									"value"	: tagstatus
								},{
									"name" 	: "modifiedByUserId",
								    "type"	: constant.SMINT,
								    "varname" : "csrid",
									"value"	: csrid
								},{
								    "name" 	: "lastModifiedDateTime",
								    "type"	: constant.DATE_TIME,
								    "varname" : "SYSDATETIME()",
									"value"	: cur_date
								}];
				    condition   = [{
									"name" 	: "tagId",
									"type"	: constant.INT,
									"value"	: tagid
								},{
									"name" 	: "memberId",
									"type"	: constant.INT,
									"value"	: memberid
								}];	
				 	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
				 		if(response_data.details>0)
						{
							//callback();
							response_data.updation_detail.push({ "tag"   :  tagid , 
					              "action"  :  'update' ,
					              "success" : true,
					              "message" : "Update to table tMembertags successful"
					             });                
						}
						else
						{
							response_data.updation_detail.push({ "tag"   :  tagid , 
				              "action"  :  'update' ,
				              "success" : false,
				              "message" : "Update to table tMembertags Un-successful"
				             });
							response_data.updation_error = 1;
						}
						
	        				callback_fun();
	        			
	        		});
				}
				else
				{
					 fieldlist   = [{
										"name" 	: "memberId",
										"type"	: constant.INT,
										"varname" : "memberid",
										"value"	: memberid
									},{
										"name" 	: "tagId",
									    "type"	: constant.INT,
									    "varname" : "tagid",
										"value"	: tagid
									},{
										"name" 	: "statusOfTag",
									    "type"	: constant.BIT,
									    "varname" : "tagstatus",
										"value"	: tagstatus
									},{
										"name" 	: "modifiedByUserId",
									    "type"	: constant.SMINT,
									    "varname" : "csrid",
										"value"	: csrid
									},{
										"name" 	: "insertedByUserId",
									    "type"	: constant.SMINT,
									    "varname" : "csrid",
										"value"	: csrid
									}];
				     condition   = '';
					 
				    db_query.insertToDb(req,res,condition,fieldlist,table,response_data,function(){
				    	if(response_data.details>0)
						{
							//callback();
							response_data.updation_detail.push({ "tag"   :  tagid , 
					              "action"  :  'insert' ,
					              "success" : true,
					              "message" : "Insert to table tMembertags successful"
					             });                
						}
						else
						{
							response_data.updation_detail.push({ "tag"   :  tagid , 
				              "action"  :  'insert' ,
				              "success" : false,
				              "message" : "Insert to table tMembertags Un-successful"
				             });
							response_data.updation_error = 1;
						}
	        			callback_fun();
	        			
	        		});
				}
    			
    		});
	},
    'CalladdChatHeader' : function(req,res,response_data,callback_function)
    {
		var async 	= require('async'),
		constant 	= require("config/constant");
		var memberid    = req.body.member_id,	     
		wechatId    = req.body.id,
		lat         = "",
		longitude   = "";
        var table       = constant.CHAT_HISTORY_HEADER;
		async.series ([
			function(callback){
				var utils 	= require('utility/utils');
				console.log(req.body);
				utils.GetMemberId(req,res,function(){
					console.log(req.body);
					callback();
				})
			},
			function(callback)
			{
				console.log(req.body);
				if(typeof req.body.lat !='undefined' && req.body.lat !='' && req.body.lat !=null)
				{
					console.log("true");
					var lat  = req.body.lat;
				}
				else
				{
					var lat  = 0;
				}

				if(typeof req.body.longitude !='undefined'  && req.body.longitude !='' && req.body.longitude !=null)
				{
					var longitude = req.body.longitude;
				}
				else
				{
					var longitude = 0;
				}
				var constant 	= require("config/constant"),
			    db_query 	    = require('db_query/query');
			    var  csrid      = req.body.csrId;
			    var  cur_date 	= null;   
				var statusoftag = 0;
		        console.log(longitude,"longitude");
		        console.log(lat,"lat");
		        var fieldlist = [{
									"name" 	: "ChatStartTimeStamp",
								    "type"	: constant.DATE_TIME,
								    "varname" : "SYSDATETIME()",
								 	"value"	: cur_date
								  },
	                              {
								    "name" 	: "ChatEndTimeStamp",
								    "type"	: constant.DATE_TIME,
								    "varname" : "SYSDATETIME()",
								 	"value"	: cur_date
								  },
								  {
									"name" 	: "userId",
								    "type"	: constant.SMINT,
								    "varname" : "csrid",
									"value"	: csrid
								  },
								  {
									"name" 	: "memberId",
								    "type"	: constant.INT,
								    "varname" : "memberid",
								 	"value"	: req.body.member_id
								  },
								  {
									"name" 	: "memberLat",
								    "type"	: constant.DEC_10_6,
								    "varname" : "lat",
								  	"value"	: lat
							 	  },
							  	  {
								   "name" 	: "memberLong",
								    "type"	: constant.DEC_10_6,
								    "varname" : "longitude",
								  	"value"	: longitude
								  },
								   {
									"name" 	: "memberTagAdded",
								    "type"	: constant.BIT,
								    "varname" : "statusoftag",
								    "value"	: statusoftag
								}]; 
				console.log(fieldlist);
				  var condition   = '';
				   if (typeof longitude =='undefined'  || longitude =='')
		            {
	                 longitude=0;
		            }
		        
	              if (typeof lat =='undefined'  || lat =='')
	               {
	                 lat=0;
		           }
		    	db_query.insertToDb(req,res,condition,fieldlist,table,response_data,function(){
					if(response_data.details > 0)
					{
						callback();
					}
					else
					{
						response_data.success = false;
						response_data.message = "Insert  to table tmemberChatHeaderId not successful";
						res.status(203).send({response_data});
					}
				})
	        },
			function(callback){

				var db_query    = require('db_query/query');
				sqlstring  	= 'select max(memberChatHeaderId) as max_header_id from '+constant.CHAT_HISTORY_HEADER+' where memberId='+req.body.member_id+' and userId=' + req.body.csrId  ;
			 	db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
					if(response_data.details.length>0)
					{   
					callback_function();
					}
					else
					{
						response_data.success = false;
						response_data.message = "matching data not present for member in DB table.tmemberChatHeaderId";
						res.status(203).send({response_data});
					}
				})

		}],function(err) {
				callback_function();
		});
    },
    'GetMemberId' : function(req,res,callback_function)
    {
		var async 	= require('async'),
		    constant 	= require("config/constant"),
		    db_query 	= require('db_query/query');
		var wechatId    = req.body.id;
		var table       = constant.MEMBER_MASTER_TABLE ;
		var sqlstring  = '';
		var response_data = {};
	    async.series ([
		    function(callback)
		    {
	         sqlstring="Select MemberId from " + table + " Where memberWechatId ='" +wechatId+ "'";
	         db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				if(response_data.details.length > 0 )
				{
					req.body.member_id=response_data.details[0].MemberId;
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Select from DB table tMemberMaster is successful";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
				callback_function();
		});
    },
    'getOfferDetailsList' : function(req,res,constant,where_cond,db_query,response_data,callback)
    {
    	 var query = 'select TOP 5 doff.offer_name_en as offer_name,doff.offerId as CMS_offerIds  ';
	        query+= ' from '+constant.DERIVE_OFFER_FOR_MEMBER+ ' doff';
	        query+= ' INNER JOIN '+constant.MEMBER_MASTER_TABLE+' mem ON';
	        query+= ' mem.memberId = doff.memberId where ';
	        query+=  where_cond;
	        query+= 'order by offerInsertedTimestamp desc';
			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
		        response_data.predicted_offer = response_data.details;
		        callback();
		    })
    }
}    