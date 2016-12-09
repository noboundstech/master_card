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
					return res.json({ success: false, message: 'Failed to authenticate token.',err :err });		
				} else {
					// if everything is good, save to request for use in other routes

					console.log(decoded)
					req.decoded = decoded;	
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(403).send({ 
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
			return sql.decimal(10, 6);
		}
		if(type == constant.DATE_TIME)
		{
			return sql.datetime;
		}
	},
	'addAndUpdateTags' : function(req,res,response_data,callback_fun)
	{
		var constant 	= require("config/constant"),
		db_query 		= require('db_query/query'),
		len         	= req.body.tags.length;
		var action 		= [];
		var memberid    = req.body.member_id,
			   csrid    = req.body.csr_id,
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
				 		console.log("update successfully");
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
	} 
};