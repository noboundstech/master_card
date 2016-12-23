
var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();

router.route('/fetchprofile')
.get(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');

			validate.validate_id(req,res,function(){
				
				callback();
			})
			
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback){
			var crypto 	 	= require('crypto'),
			   constant 	= require("config/constant"),
			wechatId 		= req.query.id;
			
			var db_query 	= require('db_query/query'),
				selection  	= '*',
				table    	= constant.MEMBER_MASTER_TABLE;
			var condition   = [{
								"name"	: "memberWechatId",
								"type"	: constant.VARCHAR100,
								"value"	: wechatId
							}];
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "WechatId row not present in DB table.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "select tMemberMaster error!";
			res.status(200).send({message:response_data});
	});
});
router.route('/fetchtag')
.get(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_id(req,res,function(){
				callback();
			})
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
			var crypto 	 	= require('crypto'),
			constant 	    = require("config/constant"),
			wechatId 		= req.query.id;
			var db_query 	=  require('db_query/query'),
			sqlstring  	= 'select tm.tagDesc,tm.tagId from '+constant.TAG_MASTER_TABLE+' tm,'+constant.MEMBER_TAG_TABLE+' mt,'+constant.MEMBER_MASTER_TABLE+' mm where tm.tagId=mt.tagId and mt.memberId=mm.memberId and mt.statusOfTag = 1 and mm.memberWechatId='+"'"+ wechatId +"'";
		//	sqlstring  	= 'select tm.tagDesc from tTagMaster tm,tMemberTags mt,tMemberMaster mm where tm.tagId=mt.tagId and mt.memberId=mm.memberId and mm.memberWechatId='+"'"+ wechatId +"'";	
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "matching Tag not present for member in DB table.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "select Member tag error!";
			res.status(200).send({message:response_data});
	});
});
router.route('/addtag')
.post(function (req, res) 
{
	var constant 	= require("config/constant"),
		db_query 	= require('db_query/query'),
		utils	 	= require('utility/utils'),
		len         = req.body.tags.length;
		action 		= [],
		memberid    = req.body.member_id,
	//	csrid    	= req.body.csr_id,
        tagstatus   = 1,		      
	    wechatId    = req.body.id,
         table     	= constant.MEMBER_TAG_TABLE;
    var fieldlist  ={};
    var condition  ={};
	var async 		= require('async');
	var response_data = {};
	response_data.updation_detail = [];
	response_data.updation_error = 0;
	var send_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_tags(req,res,function(){
				
				callback();
			})
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
        function(callback){
        	if(len>0)
        	{
        		var total_row = 0;
        		for(row=0;row<len;row++)	
        		{
        			utils.addAndUpdateTags(req,res,row,response_data,function(){
        				total_row++;
        				if(total_row == len)
        				{
        					callback();
        				}
        			})
        		}
        	}
        	else
        	{
        		res.status(203).send({	"status" 		: false,
						"error_type" 	: "validate error",
						"message" 		: "please provide tag which you want to insert"
					});
        	}
		   },function(callback){
			var crypto 	 	= require('crypto'),
			constant 	    = require("config/constant"),
		    db_query 	    = require('db_query/query');
		    var table       = constant.CHAT_HISTORY_HEADER;
		    var tagaddedstatus =0;
		    var cur_date = null ;
		    var chatheaderid   = req.body.chatheaderid;
		    var fieldlist   = [
								 {
									"name" 	: "memberTagAdded",
								    "type"	: constant.BIT,
								    "varname" : "tagaddedstatus",
									"value"	: tagaddedstatus
							 	},
							 	 {
								    "name" 	: "ChatStartTimeStamp",
								    "type"	: constant.DATE_TIME,
								    "varname" : "SYSDATETIME()",
								 	"value"	: cur_date
								  }];
		     var condition   = [{
								"name" 	: "memberChatHeaderId",
								"type"	: constant.INT,
								"value"	: chatheaderid
							}];				 	
	    	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
				if(response_data.details > 0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "update  to table tMemberChatHistoryHeader Addtag flag not successful";
					res.status(203).send({response_data});
				}
			})
 
		}],function(err) {
			response_data.success = true;
			response_data.message = "You Have Successfully added the tags!";
			res.status(200).send({message:response_data});
	});
});

router.route('/removetag')
.post(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_tags(req,res,function(){
				callback();
			})
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
			var crypto 	 	= require('crypto'),
			constant 	    = require("config/constant"),
		    db_query 	    = require('db_query/query'),
		    len= req.body.tags.length;
		    var memberid      = req.body.member_id,
			    csrid      =   req.decoded.userId,
			    tagstatus  = 0,	      
			    wechatId   = req.body.id,
			    cur_date   = null,
			    table      = constant.MEMBER_TAG_TABLE;
					 
					
			       var tagid       = req.body.tags[0].tagId;
			       var fieldlist   = [
							 {
								"name" 	: "statusOfTag",
							    "type"	: constant.BIT,
							    "varname" : "tagstatus",
								"value"	: tagstatus
						 	},
						 	{
								"name" 	: "modifiedByUserId",
							    "type"	: constant.SMINT,
							    "varname" : "csrid",
								"value"	: csrid
							  },

							  {
								"name" 	: "lastModifiedDateTime",
							    "type"	: constant.DATE_TIME,
							    "varname" : "SYSDATETIME()",
								"value"	: cur_date
							  }  ];
					var condition   = [{
								"name" 	: "memberId",
								"type"	: constant.INT,
								"value"	: memberid
							},{
								"name" 	: "tagId",
								"type"	: constant.INT,
								"value"	: tagid
							}];
			
	    	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
				if(response_data.details > 0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "update  to table tMembertags not successful";
					res.status(203).send({response_data});
				}
			})
     
		}],function(err) {
			response_data.success = true;
			response_data.message = "update to table tMembertags ok!";
			res.status(200).send({message:response_data});
	});
});
//************************************************************
router.route('/fetchalltag')
.get(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
			var crypto 	 	= require('crypto'),
		    constant 	= require("config/constant"),
			wechatId 		= req.query.id;
			var db_query 	= require('db_query/query'),
				selection 	= '*',
				table    	= constant.TAG_MASTER_TABLE;
			var condition   = '';
			db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
				if(response_data.details.length>0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "No tags row not present in DB table.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.success = true;
			response_data.message = "select tTagmaster error!";
			res.status(200).send({message:response_data});
	});
});
//********************************************************
router.route('/offerSentbyCSR')
.post(function (req, res) {
	var async 	= require('async');
	var response_data = {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_offersent(req,res,function(){
				callback();
			})
		},function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
			var crypto 	 	= require('crypto'),
			constant 	    = require("config/constant"),
		    db_query 	    = require('db_query/query');
	
		    var memberid      = req.body.member_id,
			      csrid       = req.decoded.userId,
			      offerid     = req.body.offer_id,			      
			       wechatId   = req.body.id;
			      
			       table     = constant.OFFER_SENT_TO_MEMBER_BY_CSR;
			    var  cur_date = null;   
				var statusoftag =0;	 
	
			       var fieldlist   = [

							 {
								"name" 	: "memberId",
							    "type"	: constant.INT,
							    "varname" : "memberid",
							 	"value"	: memberid
							  },
							 {
								"name" 	: "offerId",
							    "type"	: constant.INT,
							    "varname" : "offerid",
							  	"value"	: offerid
						 	},
						  	{
								"name" 	: "insertedByUserId",
							    "type"	: constant.SMINT,
							    "varname" : "csrid",
								"value"	: csrid
							  },
                            {
								"name" 	: "assignedDateTime",
							    "type"	: constant.DATE_TIME,
							    "varname" : "SYSDATETIME()",
							    "value"	: cur_date
							  },
							   {
								"name" 	: "statusOfTag",
							    "type"	: constant.BIT,
							    "varname" : "statusoftag",
								"value"	: statusoftag
							  }
							 
                               ];
					var condition   = '';
		
	    	db_query.insertToDb(req,res,condition,fieldlist,table,response_data,function(){
				if(response_data.details > 0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Insert  to table tOfferSenttoMemberByCSR not successful";
					res.status(203).send({response_data});
				}
			})
     
		}],function(err) {
			response_data.success = true;
			response_data.message = "Insert to table tOfferSenttoMemberByCSR ok!";
			res.status(200).send({message:response_data});
	});
});
//*********************************************
router.route('/AddChatHeader')
.post(function (req, res) {
	var async 	= require('async');
	
	    wechatId    = req.body.id,
			lat         = "",
			longitude   = "",
	       constant 	= require("config/constant");
	var table       = constant.CHAT_HISTORY_HEADER;
	var response_data = {};
	async.series([
		
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_body_id(req,res,function(){
				callback();
			})
		},function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				req.body.csrId = req.decoded.userId;
				callback();
			})
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.GetMemberId(req,res,function(){
				callback();
			})
		},
		function(callback)
		{
			var utils 	= require('utility/utils');
			var memberid    = req.body.member_id;
			utils.CalladdChatHeader(req,res,response_data,function(){

				callback();
			})
		}
		],function(err) {
			response_data.success = true;
			response_data.message = "Insert to table tmemberChatHeader ok!";
			res.status(200).send({message:response_data});
	});
});
//****************************************************************
router.route('/UpdateChatHeader')
.post(function (req, res) {
	var async 	= require('async');
	var		chatheaderid   = req.body.chatheaderid,		
	        constant 	= require("config/constant");
	var table       = constant.CHAT_HISTORY_HEADER;
	var response_data = {};
	async.series([
		
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_headerid(req,res,function(){
				callback();
			})
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback){
			var crypto 	 	= require('crypto'),
			constant 	    = require("config/constant"),
		    db_query 	    = require('db_query/query');
		    var  cur_date = null;   
		 
	            
			       var fieldlist   = [
			                 
                              {
							    "name" 	: "ChatEndTimeStamp",
							    "type"	: constant.DATE_TIME,
							    "varname" : "SYSDATETIME()",
							 	"value"	: cur_date
							  }						 						  								
                               ];
					var condition   = 
					           { 
					           	"name" 	: "memberChatHeaderId",
							    "type"	: constant.INT,
				     		 	"value"	: chatheaderid
							    }
			
	    	db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
				if(response_data.details > 0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "Update  to table tmemberChatHeaderId not successful";
					res.status(203).send({response_data});
				}
			})
       
		}],function(err) {
			response_data.success = true;
			response_data.message = "Update  to table tmemberChatHeader ok!";
			res.status(200).send({message:response_data});
	});
});
//****************************************************************

router.route('/AddChatDetails')
.post(function (req, res) {
    var async     = require('async');
    var response_data = {};
    async.series([
    /*	function(callback) {
			var validate = require('utility/validate');
			validate.validate_chatdetails(req,res,function(){
				callback();
			})
		},*/
         function(callback){
            var utils     = require('utility/utils');
            utils.checkAuthentication(req,res,function(){
                callback();
            })
        },
        function(callback){
            var utils     = require('utility/utils'),
              constant    = require("config/constant"),
              db_query    = require('db_query/query');
            var len_chat= req.body.chat_details.length;
            var table = constant.CHAT_HISTORY_DETAILS;
		 
			var fieldlist   = "(memberChatHeaderId,converseBy,typeOfData,chatText,chatImage,chatSound,offerId)"; 							
			var vallist = '';					
								
            if(len_chat>0)
            {
            
                for(row=0;row<len_chat;row++)
                {
                	 var memberid    = req.body.chat_details[row].member_id,
			             csrid       = req.decoded.userId,
			             offerid     = 0,
			             wechatId    = req.body.chat_details[row].cust_id,
			             converseby  = req.body.chat_details[row].converseby,
			             typeofdata  = req.body.chat_details[row].typeofdata, 
			             textdata    = req.body.chat_details[row].message,
		             chatheaderid    = req.body.chat_details[row].chatheaderid,
			         // imagedata    = req.body.imagedata,
			         // sounddata    = req.body.sounddata,
			            	imagedata    = null,
			            	sounddata    = null;
			         var 	offer_cnt = 0,
			         		len_offer = 0;  
                	if (len_offer == 0  || typeof req.body.chat_details[row].offer_details == 'undefined')
		             {

			             
		              vallist+="(";
		              vallist+=chatheaderid+",'"+converseby+"','"+typeofdata+"','"+textdata+"',"+imagedata+","+sounddata+","+offerid ;
		              vallist+=")";
					 }
					else 
					{
						len_offer = req.body.chat_details[row].offer_details.length;
				      for(offer_cnt=0;offer_cnt<len_offer;offer_cnt++)
			            {
				           offerid= req.body.chat_details[row].offer_details[offer_cnt].offer_id;
				           vallist+="(";
		                   vallist+=chatheaderid+",'"+converseby+"','"+typeofdata+"','"+textdata+"',"+imagedata+","+sounddata+","+offerid ;
		                   vallist+=")";
				
					       if(offer_cnt < (len_offer-1))
					         {
			                   vallist+=",";
			                 }
			            }       
					
					} // end of else
			         if(row < (len_chat-1))
					         {
			                   vallist+=",";
			                 }
				  }  // end of for
        
				db_query.MultiInsertToDb(req,res,vallist,fieldlist,table,response_data,function(){
				if(response_data.details > 0)
				{
					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "MultiInsert to table tmemberChatDetails not successful";
					res.status(203).send({response_data});
				}
			   })

			} // end of if (len_chat>0)
            else
            {
                res.status(203).send({    "status"         : false,
                        "error_type"     : "validate error",
                        "message"         : "please provide chat details which you want to insert"
                });
            }
        }],function(err) {
            response_data.success = true;
            response_data.message = "Insert to table tmemberChatDetails ok!";
            res.status(200).send({message:response_data});
    });
});


//********************************************************
router.route('/searchbymerchant')
.get(function (req, res) {
	var async 			= require('async');
	var response_data 	= {};
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_id(req,res,function(){
				callback();
			}) 
		},
		function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
			var constant 	= require("config/constant"),
				wechatid	= req.query.id;
		    var memberid    = req.query.member_id;
			var db_query 	= require('db_query/query');
					
		    var	sqlstring  = "select " ;
				sqlstring +="offmerch.offerId ,offmerch.merchantId ,offmerch.merchantName,offmerch.offer_rule_en,";
				sqlstring +="count(offmerch.merchantId) as cnt ";
				sqlstring +="from "+constant.MEMBER_TAG_TABLE +" as memtag " ;
				sqlstring +="INNER JOIN "+constant.TAG_SUBCAT_RELATION+" as tagsubcat on tagsubcat.tagId = memtag.tagId ";
				sqlstring +="INNER JOIN "+constant.OFFER_BY_MERCHANTS+" as offmerch on tagsubcat.subCategoryId = offmerch.subCategoryId ";
				sqlstring +="INNER JOIN "+constant.MERCHANT_MASTER+" as mem on offmerch.merchantId = mem.merchantId ";
				sqlstring +="where memtag.memberId ="+memberid+" and memtag.statusOfTag = 1 ";
				sqlstring +="group by offmerch.merchantId, offmerch.offerId, offmerch.merchantName,offmerch.offer_rule_en ";
				
				sqlstring +="union all ";
				
				sqlstring +="select null as offerId,";
          		sqlstring +="b.merchantId," ;
          		sqlstring +="b.merchantName," ;
          		sqlstring +="b.offer_rule_en," ;
          		sqlstring +="sum(b.cnt) as cnt from ";
				sqlstring +="(select offmerch.offerId ,offmerch.merchantId ,offmerch.merchantName, ";
        		sqlstring +="offmerch.offer_rule_en, ";
        		sqlstring +="count(offmerch.merchantId) as cnt ";
				sqlstring +="from "+constant.MEMBER_TAG_TABLE +" as memtag " ;
				sqlstring +="INNER JOIN "+constant.TAG_SUBCAT_RELATION+ " as tagsubcat on tagsubcat.tagId = memtag.tagId ";
				sqlstring +="INNER JOIN "+constant.OFFER_BY_MERCHANTS+" as offmerch on tagsubcat.subCategoryId = offmerch.subCategoryId ";
				sqlstring +="INNER JOIN "+constant.MERCHANT_MASTER+" as mem on offmerch.merchantId = mem.merchantId ";
				sqlstring +="where memtag.memberId ="+memberid+" and memtag.statusOfTag = 1 ";
				sqlstring +="group by ";
				sqlstring +="offmerch.merchantId,offmerch.offerId ,offmerch.merchantName ,offmerch.offer_rule_en ";
				sqlstring +=")b group by b.merchantId, b.merchantName,offer_rule_en ";
				sqlstring +="order by merchantId,cnt asc,offerId desc " ;
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				len=response_data.details.length;
				if(len>0)
				{ 
					var merch_detail = [];
					response_data.mdetail =[];
					for (t=0;t<len;t++)	
					{

					 	if(response_data.details[t].offerId == null)
					 	{
			
					 		response_data.mdetail.push({"merch_detail": merch_detail,
					 									"merchantId": response_data.details[t].merchantId ,
	               						   				"merchantName": response_data.details[t].merchantName,
					 									"merch_total": response_data.details[t].cnt});
					 		merch_detail = [];
			
					 	}
					 	else
					 	{
					 		merch_detail.push({ "offerId": response_data.details[t].offerId,
	                                      "offer_rule_en": response_data.details[t].offer_rule_en
	                                       });

					 	}
					 	if(t == len-1)
					 	{
					 		callback();
					 	}
					 }

				}
				else
				{
					response_data.success = false;
					response_data.message = "MemberId row not present in DB table.";
					res.status(203).send({response_data});
				}
			})
		}],function(err) {
			response_data.details = "";
			response_data.success = true;
			response_data.message = "select Merchant search done!";
			res.status(200).send({response_data});
	});
});	
//******************************************************************
router.route('/searchbydistance')
.get(function (req, res) {
    var async             = require('async');
    var response_data     = {};
    async.series([
        function(callback) {
            var validate = require('utility/validate');
            validate.validate_id(req,res,function(){
                callback();
            })
        },function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},function(callback){
            var constant     = require("config/constant"),
                wechatid    = req.query.id;
            var memberid    = req.query.member_id;
            var db_query     = require('db_query/query');
        //    var in_latitude  = req.query.lat;
        //    var in_longitude =req.query.long;
            var in_latitude  = req.query.lat;
            var in_longitude =req.query.lon;
            var sqlstring  = "select " ;
                sqlstring +="offmerch.offerId ,offmerch.merchantId ,offmerch.merchantName,offmerch.offer_rule_en, ";
                sqlstring +=" dbo.udf_Haversine(mloc.AddressLatitude,mloc.Addresslongitude,"+ in_latitude + " ,"+in_longitude +") as distance, "
                sqlstring +="count(offmerch.merchantId) as cnt ";
                sqlstring +="from "+constant.OFFER_BY_MERCHANTS+" as offmerch " ;
                sqlstring +="INNER JOIN "+constant.MERCHANT_MASTER+" as mem on offmerch.merchantId = mem.merchantId ";
                sqlstring +="INNER JOIN "+constant.MERCHANT_LOCATION +"  as mloc on  mloc.merchantId = offmerch.merchantId ";
                sqlstring +="INNER JOIN "+constant.TAG_SUBCAT_RELATION+" as tagsubcat on tagsubcat.subCategoryId = offmerch.subCategoryId   ";
                sqlstring +="INNER JOIN "+constant.MEMBER_TAG_TABLE+" as memtag on tagsubcat.tagId = memtag.tagId ";
                sqlstring +="where memtag.memberId ="+memberid+" and memtag.statusOfTag = 1 ";
                sqlstring +="group by offmerch.merchantId, offmerch.offerId, offmerch.merchantName,offmerch.offer_rule_en ,mloc.AddressLatitude,mloc.Addresslongitude ";
                sqlstring +="union all ";
                sqlstring +="select null as offerId,";
                sqlstring +="b.merchantId," ;
                sqlstring +="b.merchantName," ;
                sqlstring +="b.offer_rule_en," ;
                sqlstring +="b.distance, " ;
                sqlstring +="sum(b.cnt) as cnt from ";
                sqlstring +="(select offmerch.offerId ,offmerch.merchantId ,offmerch.merchantName, ";
                sqlstring +="offmerch.offer_rule_en, ";
                sqlstring +=" dbo.udf_Haversine(mloc.AddressLatitude,mloc.Addresslongitude,"+ in_latitude + " ,"+in_longitude +") as distance, "
                sqlstring +="count(offmerch.merchantId) as cnt ";
                sqlstring +="from "+constant.OFFER_BY_MERCHANTS+" as offmerch " ;
                sqlstring +="INNER JOIN "+constant.MERCHANT_MASTER+" as mem on offmerch.merchantId = mem.merchantId ";
                sqlstring +="INNER JOIN "+constant.MERCHANT_LOCATION +"  as mloc on  mloc.merchantId = offmerch.merchantId ";
                sqlstring +="INNER JOIN "+constant.TAG_SUBCAT_RELATION+" as tagsubcat on tagsubcat.subCategoryId = offmerch.subCategoryId   ";
                sqlstring +="INNER JOIN "+constant.MEMBER_TAG_TABLE+" as memtag on tagsubcat.tagId = memtag.tagId ";
                sqlstring +="where memtag.memberId ="+memberid+" and memtag.statusOfTag = 1 ";
                sqlstring +="group by ";
                sqlstring +="offmerch.merchantId,offmerch.offerId ,offmerch.merchantName ,offmerch.offer_rule_en ,mloc.AddressLatitude,mloc.Addresslongitude ";
                sqlstring +=")b group by b.merchantId, b.merchantName,b.offer_rule_en,b.distance  ";
                sqlstring +="order by merchantId,cnt asc,distance asc ,offerId desc "
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                len=response_data.details.length;
                if(len>0)
                {
                    var merch_dist_detail = [];
                    response_data.mdetail =[];
                    for (t=0;t<len;t++)
                    {

                         if(response_data.details[t].offerId == null)
                         {
							response_data.mdetail.push({
														"merch_dist_detail": merch_dist_detail,
														"merch_dist_total": response_data.details[t].cnt,
														"merchantId": response_data.details[t].merchantId ,
                                              			"merchantName": response_data.details[t].merchantName,
                                              			"distance": parseInt(response_data.details[t].distance)
                                              		   });
                            merch_dist_detail = [];
                         }
                         else
                         {
                             merch_dist_detail.push({ "offerId": response_data.details[t].offerId,
			                                          "offer_rule_en": response_data.details[t].offer_rule_en
                                           			});

                         }
                         if(t == len-1)
                         {
                             callback();
                         }
                     }

                }
                else
                {
                    response_data.success = false;
                    response_data.message = "MemberId row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })
        }],function(err) {
            response_data.details = "";
            response_data.success = true;
            response_data.message = "select Merchant search done!";
            res.status(200).send({response_data});
    });
}); 
router.route('/fetchofferhistory')
.get(function (req, res) {
    var async             = require('async');
    var response_data     = {};
    var constant         = require("config/constant");
    async.series([
        function(callback) {
            var validate = require('utility/validate');
            validate.validate_id(req,res,function(){
                callback();
            })
        },
        function(callback){
			var utils 	= require('utility/utils');
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback){
            var id        = req.query.id;
            var db_query     = require('db_query/query');
          
            var sqlstring = '';
                sqlstring = 'select TOP ' + constant.TOP_OFFER_HISTORY_COUNT+' deroff.offerId,deroff.offer_name_en,offmer.merchantId, ';
                sqlstring += 'offmer.merchantName from '+constant.DERIVE_OFFER_FOR_MEMBER + ' deroff, ';
                sqlstring += constant.OFFER_BY_MERCHANTS +' offmer, '+ constant.MEMBER_MASTER_TABLE + ' mem ';
                sqlstring += ' where deroff.offerId =offmer.offerId and ';
                sqlstring += ' deroff.memberId = mem.memberId and mem.memberWechatId = '+"'"+ id + "' ";
                sqlstring += ' order by deroff.offerInsertedTimestamp desc';

            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                if(response_data.details.length>0)
                {
                    callback();
                }
                else
                {
                    response_data.success = false;
                     response_data.message = "No Offer History row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })
        }],function(err) {
            response_data.success = true;
            response_data.message = "select Offer History search done!";
            res.status(200).send({response_data});
    });
});   
module.exports = router;