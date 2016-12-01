var express = require('express'),
    router  = express.Router();
//********************************************************
router.route('/getCustReportList')
.get(function (req, res) {
	var async 			= require('async');
	var response_data 	= {};
	
	async.series([
		function(callback) {
			var constant 	= require("config/constant");
			var len_age=constant.AGE_GROUP.length;
			response_data.age_group=[];
			 for (t_age=0;t_age<len_age;t_age++)	
				 {

				 	response_data.age_group.push({"value":constant.AGE_GROUP[t_age].value,
				 	                             });
                  }  // end of for
				callback();
		 },function(callback){
			var crypto 	 	= require('crypto'),
			   constant 	= require("config/constant"),
			   db_query 	= require('db_query/query');
		//************* Customer segment ************			
		    var	sqlstring  = "select distinct memberSegment from "+ constant.MEMBER_MASTER_TABLE + ' where memberSegment IS NOT NULL';
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				var len_seg=response_data.details.length;
				if(len_seg>0)
				{ 
					response_data.custseg=[];
				 for (t_seg=0;t_seg<len_seg;t_seg++)	
				 {
            		response_data.custseg.push({ "cust_segment": response_data.details[t_seg].memberSegment
               							           });
			     }
                 callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "MemberSegment row not present in DB table.";
					res.status(203).send({response_data});
				}
				
			})
		   },
			function(callback){
			var crypto 	 	= require('crypto'),
			   constant 	= require("config/constant"),
			    db_query 	= require('db_query/query');
		
		//************* Customer Location  ************			
		    var	sqlstring  = "select distinct City from "+ constant.MEMBER_MASTER_TABLE + ' where City IS NOT NULL';
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				var len_loc=response_data.details.length;
				if(len_loc>0)
				{ 
					response_data.custloc=[];
				 for (t_loc=0;t_loc<len_loc;t_loc++)	
				 {
            		response_data.custloc.push({ "cust_location": response_data.details[t_loc].City
               							           });
			     }

					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "City row not present in DB table.";
					res.status(203).send({response_data});
				}
			})
		    },
			function(callback){
			var crypto 	 	= require('crypto'),
				constant 	= require("config/constant"),
			   db_query 	= require('db_query/query');
	
		 //************* Card Type ************			
		    var	sqlstring  = "select distinct MTRCardType from "+ constant.MEMBER_MASTER_TABLE + ' where MTRCardType IS NOT NULL';
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				var len_card=response_data.details.length;
				if(len_card>0)
				{ 
					response_data.cardtype=[];
				 for (t_card=0;t_card<len_card;t_card++)	
				 {
            		response_data.cardtype.push({ "card_type": response_data.details[t_card].MTRCardType
               							           });
			     }

					callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "MTRCardType row not present in DB table.";
					res.status(203).send({response_data});
				}
			})
		  }],function(err) {
			response_data.details = "";
			response_data.success = true;
			response_data.message = "select Cust Segment , Loction ,MTRCardType done OK!";
			res.status(200).send({response_data});
	});
});	
//******************************************************************
router.route('/getCustSegReportData')
.get(function (req, res) {
	var async 			= require('async');
	var response_data 	= {};
	
	async.series([
		function(callback) {
			var validate = require('utility/validate');
			validate.validate_fromto_date(req,res,function(){
				callback();
			}) 
		},
		function(callback) {
			var constant 	= require("config/constant");
			var field_list='';
			var group_by_list='';
			var cond_seg='';
			var cond_age='';
			var cond_card='';
			var cond_city='';
			var cond_gender='';
			var len_seg=5;
            var len_age=2;
            var len_card=4
            var len_city=3;
            var len_gender=3;
		//********* add member segment in SQLstring
		     if (len_seg > 0)
		     {	
		     	field_list+='mm.memberSegment ';
		     	group_by_list+='mm.memberSegment ';
		     	cond_seg+=' and mm.memberSegment in(';
			 for (t_seg=0;t_seg<len_seg;t_seg++)	
				 {
				 	if (t_seg==0)
                    cond_seg+="'"+req.query.mseg[t_seg]+"'";
				    else 
				    cond_seg+=",'"+req.query.mseg[t_seg]+"'";
                  }  // end of for
                     cond_seg+=')';
              }     
         //********* add Card Type in SQLstring
              if (len_card > 0)
		     {	
		     	field_list+=',mm.MTRCardType ';
		     	group_by_list+=',mm.MTRCardType ';
		     	cond_card+=' and mm.MTRCardType in(';
			 for (t_card=0;t_card<len_card;t_card++)	
				 {
				 	if (t_card==0)
                    cond_card+="'"+req.query.mcard[t_card]+"'";
				    else 
				    cond_card+=",'"+req.query.mcard[t_card]+"'";
                  }  // end of for
                     cond_card+=')';
              }     
         //********* add City  in SQLstring
           if (len_city > 0)
		     {	
		     	field_list+=',mm.City ';
		     	group_by_list+=',mm.City ';
		     	cond_city+=' and mm.City in(';
			 for (t_city=0;t_city<len_city;t_city++)	
				 {
				 	if (t_city==0)
                    cond_city+="'"+req.query.mcity[t_city]+"'";
				    else 
				    cond_city+=",'"+req.query.mcity[t_city]+"'";
                  }  // end of for
                     cond_city+=')';
              }     
         //********* add gender  in SQLstring
              if (len_gender > 0)
		     {	
		     	field_list+=',mm.memberGender ';
		     	group_by_list+=',mm.memberGender ';
		     	cond_gender+=' and (mm.memberGender =';
			 for (t_gender=0;t_gender<len_gender;t_gender++)	
				 {
				 	if (t_gender==0)
                    cond_gender+="'"+req.query.mgender[t_gender]+"'";
				    else 
				    cond_gender+=" or '"+req.query.mgender[t_gender]+"'";
                  }  // end of for
                     cond_gender+=')';
              }     
         //********* add member Age group in SQLstring
		       if (len_age > 0)
		     {	
		     	field_list+=',mm.memberAge ';
		     	group_by_list+=',mm.memberAge ';
		     	cond_age +=' and ((mm.memberAge BETWEEN ';
			 for (t_age=0;t_age<len_age;t_age++)	
				 {
				 	if (t_age==0)
                    cond_age+=" "+req.query.mage.MIN[t_gender]+" AND "+ req.query.mage.MAX [t_gender]+ ') ';
				    else 
				    cond_age+=" or (mm.memberAge BETWEEN "+req.query.mage.MIN[t_gender]+" AND "+ req.query.mage.MAX [t_gender]+ ') ';
                  }  // end of for
                     cond_age+=')';
              }     
				
		    var	sqlstring  = "select " + field_list +" ";
		        sqlstring += "count(offres.offerSentTimestamp)as offerSent,"; 
                sqlstring += "count(offres.offerClicked) as offerClicked,"; 
                sqlstring += "count(offres.offerUsed) as offerUsed  "
                sqlstring += "from tmemberMaster mm, tOfferResponse offres ";
                sqlstring += "where mm.memberId = offres.memberId "; 
                sqlstring += "and ((month(offres.offerSentTimestamp) between 1 and 12) "; 
                sqlstring += "and ( YEAR(offres.offerSentTimestamp) = 2016)) "; 
                sqlstring += "and offres.offerSentTimestamp is not null " ;
                sqlstring += cond_seg + cond_card + cond_city + cond_gender + cond_age +" ";
				sqlstring += group_by_list;
			db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
				var len_seg=response_data.details.length;
				if(len_seg>0)
				{ 
					response_data.custseg=[];
				 for (t_seg=0;t_seg<len_seg;t_seg++)	
				 {
            		response_data.custseg.push({ "cust_segment": response_data.details[t_seg].memberSegment
               							           });
			     }
                 callback();
				}
				else
				{
					response_data.success = false;
					response_data.message = "MemberSegment row not present in DB table.";
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
module.exports = router;