var express = require('express'),
    router  = express.Router();
//********************************************************
router.route('/getCustReportList')
.get(function (req, res) {
    var async             = require('async');
    var response_data     = {};
    async.series([
        function(callback) {
            var constant     = require("config/constant");
            var len_age=constant.AGE_GROUP.length;
            response_data.age_group=[];
             for (t_age=0;t_age<len_age;t_age++)
                 {

response_data.age_group.push({"value":constant.AGE_GROUP[t_age].value,
                                                  });
                  }  // end of for

                callback();
         },function(callback){
            var crypto          = require('crypto'),
               constant     = require("config/constant"),
               db_query     = require('db_query/query');
//****************************************************************************
        //**** Distinct Customer segment list from DB table for Response  ************
//****************************************************************************
            var    sqlstring  = "select distinct memberSegment from "+ constant.MEMBER_MASTER_TABLE + ' where memberSegment IS NOT NULL';
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
            var crypto          = require('crypto'),
               constant     = require("config/constant"),
                db_query     = require('db_query/query');
//****************************************************************************
        //**** Distinct City list from DB table for Response ************
//****************************************************************************

            var    sqlstring  = "select distinct City from "+ constant.MEMBER_MASTER_TABLE + ' where City IS NOT NULL';


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
            var crypto          = require('crypto'),
                constant     = require("config/constant"),
               db_query     = require('db_query/query');

 //****************************************************************************
         //**** Distinct Card Type list from DB table for Response  ************
 //****************************************************************************
            var    sqlstring  = "select distinct MTRCardType from "+ constant.MEMBER_MASTER_TABLE + ' where MTRCardType IS NOT NULL';
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
           },
           function(callback){
            var crypto          = require('crypto'),
                constant     = require("config/constant"),
               db_query     = require('db_query/query');

//****************************************************************************
         //**** Distinct CategoryDesc list from DB table for Response  ************
 //****************************************************************************

            var    sqlstring  = "select distinct categoryDesc from "+ constant.CATEGORY + ' where categoryDesc IS NOT NULL';


db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                var len_cate=response_data.details.length;
                if(len_cate>0)
                {
                    response_data.category=[];
                 for (t_cate=0;t_cate<len_cate;t_cate++)
                 {
                    response_data.category.push({ "category": response_data.details[t_cate].categoryDesc
                                                      });
                 }

                    callback();
                }
                else
                {
                    response_data.success = false;
                    response_data.message = "categoryDesc row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })
        },
        function(callback){
            var crypto          = require('crypto'),
                constant     = require("config/constant"),
               db_query     = require('db_query/query');

//****************************************************************************
         //**** Distinct Merchant id /name list from DB table for Response  ************
 //****************************************************************************

            var    sqlstring  = "select distinct merchantName ,merchantId from "+ constant.OFFER_BY_MERCHANTS + ' where merchantName IS NOT NULL';


db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                var len_merch=response_data.details.length;
                if(len_merch>0)
                {
                    response_data.merchant=[];
                 for (t_merch=0;t_merch<len_merch;t_merch++)
                 {
                    response_data.merchant.push({
                                                   "name" :response_data.details[t_merch].merchantName,
                                                   "id" :response_data.details[t_merch].merchantId

                                                      });
                 }

                    callback();
                }
                else
                {
                    response_data.success = false;
                    response_data.message = "Merchant data row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })
        },

        function(callback){
            var crypto          = require('crypto'),
                constant     = require("config/constant"),
               db_query     = require('db_query/query');
//****************************************************************************
         //**** Distinct tag desc list from DB table for Response ************
 //****************************************************************************

            var    sqlstring  = "select distinct tagDesc ,tagId from " + constant.TAG_MASTER_TABLE+ ' where tagDesc IS NOT NULL';


db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                var len_tag=response_data.details.length;
                if(len_tag>0)
                {
                    response_data.tag=[];
                 for (t_tag=0;t_tag<len_tag;t_tag++)
                 {
                    response_data.tag.push({       "name" :response_data.details[t_tag].tagDesc,
                                                   "id" :response_data.details[t_tag].tagId

                                                    });
                 }

                    callback();
                }
                else
                {
                    response_data.success = false;
                    response_data.message = "tag Description row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })
          }],function(err) {
            response_data.details = "";
            response_data.success = true;
            response_data.message = "select Cust Segment , Loction ,MTRCardType,categoryDesc done OK!";
            res.status(200).send({response_data});
    });
});
//******************************************************************
router.route('/getCustSegReportData')
.post(function (req, res) {
    var async             = require('async');
    var constant     = require("config/constant");
    var response_data     = {};
    var x_field= req.body.x_axis;
    var y_field= req.body.y_axis;
    var x_axis_array = [];
    var y_axis_array = [];
    var from_date=req.body.date_range.from;
    var to_date=req.body.date_range.to;

             var graph1=[];
             var ydata=[];
    async.series([
        function(callback) {
            var validate = require('utility/validate');
            validate.validate_fromto_dates(req,res,function(){
                callback();
            })
        },
        function(callback) {

            var x_field_list='';
            var y_field_list='';
            var cond_sql='';
            var db_query = require('db_query/query');
            var len_seg =0;
            var len_card = 0;
            var len_gender=0;
            var len_city=0;
            var len_age=0;
            var len_tag=0;
            var sqltag_details='';
            var age_group_Yflag =' ';
            var age_group_Xflag =' ';
            var gender_Xflag=' ';
            var gender_Yflag=' ';
            var t_card=0;
            var t_seg=0;
            var t_gender=0;
            var t_city=0;
            var t_tag=0;
            var t_age=0;
//******************************************************************************
        //*********  check x  and y paramerter received  set SQL preparation variables
//******************************************************************************
        switch(x_field)
        {
//******************************************************************************
        //*********  check x paramerter and  set SQL preparation variables
//******************************************************************************
            case "segment":
                {
                     x_axis_array = req.body.segment;
                    x_field_list = 'mm.memberSegment ';
                    len_seg=req.body.segment.length;
                    cond_sql+=' and  mm.memberSegment in(';
                    for (t_seg=0;t_seg<len_seg;t_seg++)
                    {
                        if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                        else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                    }  // end of for
                    cond_sql+=')';
                    break;
                  }
            case "card_type":
                    x_axis_array = req.body.card_type;
                    x_field_list = 'mm.MTRCardType ';

                    len_card=req.body.card_type.length;
                       cond_sql+=' and mm.MTRCardType in(';
                  for (t_card=0;t_card<len_card;t_card++)
                   {
                     if (t_card==0)
cond_sql+="'"+req.body.card_type[t_card].name+"'";
                    else
cond_sql+=",'"+req.body.card_type[t_card].name+"'";
                   }  // end of for
                     cond_sql+=')';

                    break;
            case "gender":
                   x_axis_array = req.body.gender;
                   gender_Xflag= 'Y';
                   x_field_list = 'mm.memberGender ';
                    len_gender=req.body.gender.length;
                     cond_sql+=' and  mm.memberGender in(';
                    for (t_gender=0;t_gender<len_gender;t_gender++)
                    {
                             if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                            else
cond_sql+=",'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                    }  // end of for
                    cond_sql+=')';
                     break;
            case "location":
                   x_field_list = 'mm.City ';
                   x_axis_array = req.body.location;
                   len_city=req.body.location.length;
                      cond_sql+=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
            case "tags":
                    x_field_list = 'tm.tagDesc ';
                    x_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                    cond_sql +=' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in ( ';


                     sqltag_details=','+constant.MEMBER_TAG_TABLE + ' memtag,'+ constant.TAG_MASTER_TABLE + ' tm ';
                    for (t_tag=0;t_tag<len_tag;t_tag++)
                    {
                        if (t_tag==0)
                        {
cond_sql+="'"+req.body.tags[t_tag].name+"'";
                        }
                        else
                        {
cond_sql+=",'"+req.body.tags[t_tag].name+"'";
                        }
                    }  // end of for
                    cond_sql+=' )';
                    break;
            case "age_grouped":
                   x_field_list = 'mm.memberAge';
                   x_axis_array = req.body.age_grouped;
                   len_age=req.body.age_grouped.length;
                   age_group_Xflag='Y';
                    cond_sql +=' and ((mm.memberAge BETWEEN ';
                   for (t_age=0;t_age<len_age;t_age++)
                   {
                    var str_name =req.body.age_grouped[t_age].name;
                    var str_arr  =str_name.split("to");
                    var min = str_arr[0];
                    var max = str_arr[1];
                     if (t_age==0)
                    cond_sql+=" "+min+" AND "+ max + ') ';
                    else
                    cond_sql+=" or (mm.memberAge BETWEEN "+ min+" AND "+ max+ ") ";
                  }  // end of for
                     cond_sql+=')';
                    break;
           default: "segment"
                    break;
         }  // end of switch

         switch(y_field)
        {
 //******************************************************************************
     //*********  check Y paramerter and  set SQL preparation variables
 //******************************************************************************
            case "segment":
                {
                 y_field_list = 'mm.memberSegment ';
                 y_axis_array = req.body.segment;
                 len_seg=req.body.segment.length;
                 cond_sql+=' and  mm.memberSegment in(';
                 for (t_seg=0;t_seg<len_seg;t_seg++)
                   {
                     if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                    else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                  }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "card_type":
                 {
                    y_field_list = 'mm.MTRCardType ';
                    y_axis_array = req.body.card_type;
                    len_card=req.body.card_type.length;
                       cond_sql+=' and mm.MTRCardType in(';
                  for (t_card=0;t_card<len_card;t_card++)
                   {
                     if (t_card==0)
cond_sql+="'"+req.body.card_type[t_card].name+"'";
                    else
cond_sql+=",'"+req.body.card_type[t_card].name+"'";
                   }  // end of for
                     cond_sql+=')';

                    break;
                   }
            case "gender":
                  {
                   y_field_list = 'mm.memberGender ';
                   y_axis_array = req.body.gender;
                   gender_Yflag='Y';
                    len_gender=req.body.gender.length;
                     cond_sql+=' and  mm.memberGender in(';
                    for (t_gender=0;t_gender<len_gender;t_gender++)
                    {
                             if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                            else
cond_sql+=",'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                    }  // end of for
                    cond_sql+=')';
                     break;
                   }
            case "location":
                 {
                   y_field_list = 'mm.City ';
                   y_axis_array = req.body.location;
                   len_city=req.body.location.length;
                      cond_sql+=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "tags":
                  {
                    y_field_list = 'tm.tagDesc ';
                    y_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                   cond_sql +=' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in( ';
                    sqltag_details=','+constant.MEMBER_TAG_TABLE + ' memtag,'+ constant.TAG_MASTER_TABLE + ' tm ';

                  for (t_tag=0;t_tag<len_tag;t_tag++)
                   {
                     if (t_tag==0)
                    cond_sql+="'"+req.body.tags[t_tag].name+"'";
                    else
                    cond_sql+=",'"+req.body.tags[t_tag].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                   }
            case "age_grouped":
                  {
                   y_field_list = 'mm.memberAge';
                   len_age=req.body.age_grouped.length;
                   y_axis_array = req.body.age_grouped;
                   age_group_Yflag='Y';
                    cond_sql +=' and ((mm.memberAge BETWEEN ';
                   for (t_age=0;t_age<len_age;t_age++)
                   {
                    var str_name =req.body.age_grouped[t_age].name;
                    var str_arr  =str_name.split("to");
                    var min = str_arr[0];
                    var max = str_arr[1];
                     if (t_age==0)
                    cond_sql+=" "+min+" AND "+ max + ') ';
                    else
                    cond_sql+=" or (mm.memberAge BETWEEN "+ min+" AND "+ max+ ") ";
                   }  // end of for
                     cond_sql+=')';
                    break;
                   }
            default: "segment"
               {
                    y_field_list = 'mm.memberSegment ';
                    len_seg=req.body.segment.length;
                    y_axis_array = req.body.segment;
                    cond_sql+=' and  mm.memberSegment in(';
                    for (t_seg=0;t_seg<len_seg;t_seg++)
                    {
                             if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                            else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                     }  // end of for
                         cond_sql+=')';
                        break;
                }
            }  // end of switch
            //************************************************
            //***    SET SQL STRING
            //************************************************
               var    sqlstring  = "select " + x_field_list +" as x_value, "+ y_field_list +" as y_value ," ;
                sqlstring += "count(offres.offerSentTimestamp)as offerSent,";
                sqlstring += "count(offres.offerClicked) as offerClicked,";
                sqlstring += "count(offres.offerUsed) as offerUsed  "
                sqlstring += "from "+ constant.MEMBER_MASTER_TABLE + " mm, " + constant.OFFER_RESPONSE +" offres ";
                sqlstring += sqltag_details + " ";
                sqlstring += "where mm.memberId = offres.memberId ";
                sqlstring += "and ((convert(datetime,offres.offerSentTimestamp,120)) between '"+from_date+ "'  and '" +to_date + "' ) ";
                sqlstring += "and offres.offerSentTimestamp is not null " ;
                sqlstring += cond_sql +" ";
                sqlstring += "group by "+x_field_list +", "+ y_field_list + " ";
                sqlstring += "order by "+x_field_list +", "+ y_field_list;
//********************************************************************
           //** create and initialize  Array matrix  with all selected X and Y Values
//*******************************************************************
            for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
             {
                 var xheader=[];
                 xheader.push({xname: x_axis_array[x_cnt].name});
                 ydata=[];
              for(y_cnt=0;y_cnt < y_axis_array.length;y_cnt++)
              {
                  ydata.push({yname: y_axis_array[y_cnt].name,
                             sent :0,
                             used :0,
                             click:0});
              }
              xheader.push({ydata});
              graph1.push({xheader});
             }

           //************************************
           //*****   Call DB API to RUN SQL
           //************************************
db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){

            if (response_data.details.length > 0)
            {
//*******************************************************
                 // sumarize response data for X axis or Y axis as age_grouped
                 // Special Check  for Age Group   and Gender to override DB table value with
                // X -AXIS or Y - AXIS value as DB table contains Age not Age group. Gender in DB
                // table is 'M' and 'F'. this need to be set to 'Male' 'Female'
//**********************************************************
                 if (age_group_Yflag=='Y' || age_group_Xflag=='Y' ||
                    gender_Yflag=='Y'    || gender_Xflag=='Y')
                {

                 for (var age=0;age<response_data.details.length;age++)
                 {
              //**************************************************
              //***   Process for Gender
//***************************************************

                 for(t_gender=0;t_gender<len_gender;t_gender++)
                     {
                      if ( y_axis_array[t_gender].name.substr(0, 1) == response_data.details[age].y_value)
                       {
                        response_data.details[age].y_value = y_axis_array[t_gender].name;
                       }
                      else if ( x_axis_array[t_gender].name.substr(0, 1) == response_data.details[age].x_value)
                       {
                         response_data.details[age].x_value = x_axis_array[t_gender].name;
                       }
                     }
              //**************************************************
              //***   Process for AGE Group
//***************************************************
                          if (age_group_Yflag == 'Y')
                           {  var detail_age =response_data.details[age].y_value;

                           }
                           else
                               {var detail_age =response_data.details[age].x_value;
                               }
                     for(var t_age1=0;t_age1<len_age;t_age1++)
                     {
                         if (age_group_Yflag == 'Y')
                        {
                             var str_name1 =y_axis_array[t_age1].name;
                        }
                        else
                        {
                             var str_name1 =x_axis_array[t_age1].name;
                        }

                        var str_arr1  =str_name1.split("to");
                        var min = str_arr1[0];
                        var max = str_arr1[1];
                        var min1 = min.trim();
                        var max1 = max.trim();

                       if (detail_age >= min1 && detail_age <= max1)
                       {
                                         if (age_group_Yflag == 'Y')

                                          { response_data.details[age].y_value=str_name1;
                                          }
                                         else
                                          { response_data.details[age].x_value=str_name1;
                                          }
                      }
                    }

                   response_data.tmp ={ "det" :response_data.details
                                          };

                 }     // end of for

                } // end of (age_group_Yflag='Y' || age_group_Xflag='Y')

                var graph=[];
                var graph_offer_sent=[];
                var graph_offer_used=[];
                var graph_offer_click=[];
              //**********************************************
              //  UPDATE data in matrix from result set
              //***********************************************
                  for(result = 0; result<response_data.details.length;result++)
                  {

                     for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
                    {

                      for(y_cnt=0; y_cnt < y_axis_array.length;y_cnt++)
                      {


                    if ( graph1[x_cnt].xheader[0].xname == response_data.details[result].x_value &&
graph1[x_cnt].xheader[1].ydata[y_cnt].yname == response_data.details[result].y_value)
                        {
                              if (age_group_Yflag=='Y' || age_group_Xflag=='Y')
                              {
graph1[x_cnt].xheader[1].ydata[y_cnt].sent +=response_data.details[result].offerSent;
                        graph1[x_cnt].xheader[1].ydata[y_cnt].used +=response_data.details[result].offerUsed;
graph1[x_cnt].xheader[1].ydata[y_cnt].click+=response_data.details[result].offerClicked;
                              }
                             else
                                {
graph1[x_cnt].xheader[1].ydata[y_cnt].sent =response_data.details[result].offerSent;
                        graph1[x_cnt].xheader[1].ydata[y_cnt].used =response_data.details[result].offerUsed;
graph1[x_cnt].xheader[1].ydata[y_cnt].click =response_data.details[result].offerClicked;
                              }
                       }
                      }
                     }
                  }


           } // end of if (response_data.details.length > 0)
             //***************************************************
             //  format and write matrix  to send response array
             //***************************************************
            var x_axis_name =[];
            var y_array_header=[];
            var y_array_data_sent=[];
            var y_array_data_used=[];
            var y_array_data_click=[];
            for(y_cnt=0; y_cnt < y_axis_array.length;y_cnt++)
             {
                      var name_sent=y_axis_array[y_cnt].name+' Sent';
                       var name_used=y_axis_array[y_cnt].name+' Used';
                       var name_clicked=y_axis_array[y_cnt].name+' Clicked';


                y_array_data_sent=[];
                y_array_data_used=[];
                y_array_data_click=[];
              for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
              {
                   if ((graph1[x_cnt].xheader[0].xname == x_axis_array[x_cnt].name) &&
                     (graph1[x_cnt].xheader[1].ydata[y_cnt].yname == y_axis_array[y_cnt].name))
                        {
y_array_data_sent.push(graph1[x_cnt].xheader[1].ydata[y_cnt].sent );
y_array_data_used.push(graph1[x_cnt].xheader[1].ydata[y_cnt].used );
y_array_data_click.push(graph1[x_cnt].xheader[1].ydata[y_cnt].click );
                       }

              }
                 y_array_header.push(
                                       {
                                           "name" : name_sent,
                                        "data" : y_array_data_sent,
                                        "stack": "Offer Send"});
                   y_array_header.push(
                                       {"name" : name_used,
                                        "data" : y_array_data_used,
                                        "stack": "Offer Used"});
                 y_array_header.push(
                                       {"name" : name_clicked,
                                        "data" : y_array_data_click,
                                        "stack": "Offer Clicked"});

            }
           for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
                    {
x_axis_name.push(graph1[x_cnt].xheader[0].xname);


                     }
                response_data.Graph_data =[{ x_axis_name ,
                                             y_array_header

                                          }];
              if (response_data.details.length > 0)
               {      callback();
               }
                     else
                {
                    response_data.success = false;
                    response_data.message = "No data available please select more or other options.";
                    res.status(203).send({response_data});
                }


               }) // end of  DB call function

        }],function(err) {
        //    response_data.details = "";
            response_data.success = true;
            response_data.message = "select Customer Segment done OK!";
            res.status(200).send({response_data});
    });
});
//*****************************************************************
router.route('/getOfferSegReportData')
.post(function (req, res) {
    var async             = require('async');
    var constant     = require("config/constant");
    var response_data     = {};
    var x_field= req.body.x_axis;
    var y_field= req.body.y_axis;
    var x_axis_array = [];
    var y_axis_array = [];
    var from_date=req.body.date_range.from;
    var in_offerId =req.body.offer_id;
    var to_date=req.body.date_range.to;
    var graph1=[];
    var ydata=[];
    async.series([
        function(callback) {
            var validate = require('utility/validate');
            validate.validate_fromto_dates(req,res,function(){
                callback();
            })
        },
        function(callback) {

            var x_field_list='';
            var y_field_list='';
            var cond_sql='';
            var db_query = require('db_query/query');
            var len_seg =0;
            var len_card = 0;
            var len_gender=0;
            var len_city=0;
            var len_age=0;
            var len_tag=0;
            var len_category=0;
            var sqltag_details='';
            var age_group_Yflag =' ';
            var age_group_Xflag =' ';
            var gender_Xflag=' ';
            var gender_Yflag=' ';
            var t_card=0;
            var t_seg=0;
            var t_gender=0;
            var t_city=0;
            var t_tag=0;
            var t_age=0;
            var t_category=0;
//******************************************************************************
        //*********  check x  and y paramerter received and set SQL preparation variables
//******************************************************************************
        switch(x_field)
        {
//******************************************************************************
        //*********  check x paramerter and  set SQL preparation variables
//******************************************************************************
            case "segment":
                {
                     x_axis_array = req.body.segment;
                    x_field_list = 'mm.memberSegment ';
                    len_seg=req.body.segment.length;
                    cond_sql+=' and  mm.memberSegment in(';
                    for (t_seg=0;t_seg<len_seg;t_seg++)
                    {
                        if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                        else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                    }  // end of for
                    cond_sql+=')';
                    break;
                  }
            case "card_type":
                 {
                    x_axis_array = req.body.card_type;
                    x_field_list = 'mm.MTRCardType ';

                    len_card=req.body.card_type.length;
                       cond_sql+=' and mm.MTRCardType in(';
                  for (t_card=0;t_card<len_card;t_card++)
                   {
                     if (t_card==0)
cond_sql+="'"+req.body.card_type[t_card].name+"'";
                    else
cond_sql+=",'"+req.body.card_type[t_card].name+"'";
                   }  // end of for
                     cond_sql+=')';

                    break;
                 }
            case "gender":
                 {
                   gender_Xflag='Y' ;
                   x_axis_array = req.body.gender;
                   x_field_list = 'mm.memberGender ';
                    len_gender=req.body.gender.length;
                    cond_sql+=' and  mm.memberGender in(';
                    for (t_gender=0;t_gender<len_gender;t_gender++)
                    {
                             if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                            else
cond_sql+=",'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                    }  // end of for
                    cond_sql+=')';
                    break;
                  }
            case "location":
                  {
                   x_field_list = 'mm.City ';
                   x_axis_array = req.body.location;
                   len_city=req.body.location.length;
                      cond_sql+=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                     break;
                  }
            case "tags":
                {
                    x_field_list = 'tm.tagDesc ';
                    x_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                    cond_sql +=' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in( ';
                    sqltag_details=','+constant.MEMBER_TAG_TABLE + ' memtag,'+ constant.TAG_MASTER_TABLE + ' tm ';
                  for (t_tag=0;t_tag<len_tag;t_tag++)
                   {
                     if (t_tag==0)
                    cond_sql+="'"+req.body.tags[t_tag].name+"'";
                    else
                    cond_sql+=",'"+req.body.tags[t_tag].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                 }
             case "category":
                 {
                   x_field_list = 'offmer.categoryDesc ';
                   x_axis_array = req.body.category;
                   len_category=req.body.category.length;
                      cond_sql+=' and offmer.categoryDesc in(';
                   for (t_category=0;t_category<len_category;t_category++)
                   {
                     if (t_category==0)
cond_sql+="'"+req.body.category[t_category].name+"'";
                    else
cond_sql+=",'"+req.body.category[t_category].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "age_grouped":
                 {
                   x_field_list = 'mm.memberAge';
                   x_axis_array = req.body.age_grouped;
                   len_age=req.body.age_grouped.length;
                   age_group_Xflag='Y';
                    cond_sql +=' and ((mm.memberAge BETWEEN ';
                   for (t_age=0;t_age<len_age;t_age++)
                   {
                    var str_name =req.body.age_grouped[t_age].name;
                    var str_arr  =str_name.split("to");
                    var min = str_arr[0];
                    var max = str_arr[1];
                     if (t_age==0)
                    cond_sql+=" "+min+" AND "+ max + ') ';
                    else
                    cond_sql+=" or (mm.memberAge BETWEEN "+ min+" AND "+ max+ ") ";
                    }  // end of for
                     cond_sql+=')';
                    break;
                  }
           default: "segment"
                  {
                    x_axis_array = req.body.segment;
                    x_field_list = 'mm.memberSegment ';
                    len_seg=req.body.segment.length;
                    cond_sql+=' and  mm.memberSegment in(';
                    for (t_seg=0;t_seg<len_seg;t_seg++)
                    {
                        if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                        else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                    }  // end of for
                    cond_sql+=')';
                    break;
                  }
         }  // end of switch
         switch(y_field)
        {
 //******************************************************************************
     //*********  check Y paramerter and  set SQL preparation variables
 //******************************************************************************
            case "segment":
                {
                 y_field_list = 'mm.memberSegment ';
                 y_axis_array = req.body.segment;
                 len_seg=req.body.segment.length;
                 cond_sql+=' and  mm.memberSegment in(';
                 for (t_seg=0;t_seg<len_seg;t_seg++)
                   {
                     if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                    else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                  }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "card_type":
                 {
                    y_field_list = 'mm.MTRCardType ';
                    y_axis_array = req.body.card_type;
                    len_card=req.body.card_type.length;
                       cond_sql+=' and mm.MTRCardType in(';
                  for (t_card=0;t_card<len_card;t_card++)
                   {
                     if (t_card==0)
cond_sql+="'"+req.body.card_type[t_card].name+"'";
                    else
cond_sql+=",'"+req.body.card_type[t_card].name+"'";
                   }  // end of for
                     cond_sql+=')';

                    break;
                   }
            case "gender":
                  {
                   y_field_list = 'mm.memberGender ';
                   gender_Yflag='Y' ;
                   y_axis_array = req.body.gender;
                    len_gender=req.body.gender.length;
                    cond_sql+=' and  mm.memberGender in(';
                    for (t_gender=0;t_gender<len_gender;t_gender++)
                    {
                             if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                            else
cond_sql+=",'"+req.body.gender[t_gender].name.substr(0, 1)+"'";
                    }  // end of for
                    cond_sql+=')';

                     break;
                   }
            case "location":
                 {
                   y_field_list = 'mm.City ';
                   y_axis_array = req.body.location;
                   len_city=req.body.location.length;
                      cond_sql+=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "tags":
                  {
                    y_field_list = 'tm.tagDesc ';
                    y_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                   cond_sql +=' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in( ';
                    sqltag_details=','+constant.MEMBER_TAG_TABLE + ' memtag,'+ constant.TAG_MASTER_TABLE + ' tm ';

                  for (t_tag=0;t_tag<len_tag;t_tag++)
                   {
                     if (t_tag==0)
                    cond_sql+="'"+req.body.tags[t_tag].name+"'";
                    else
                    cond_sql+=",'"+req.body.tags[t_tag].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                   }
            case "age_grouped":
                  {
                   y_field_list = 'mm.memberAge';
                   len_age=req.body.age_grouped.length;
                   y_axis_array = req.body.age_grouped;
                   age_group_Yflag='Y';
                    cond_sql +=' and ((mm.memberAge BETWEEN ';
                   for (t_age=0;t_age<len_age;t_age++)
                   {
                    var str_name =req.body.age_grouped[t_age].name;
                    var str_arr  =str_name.split("to");
                    var min = str_arr[0];
                    var max = str_arr[1];
                     if (t_age==0)
                    cond_sql+=" "+min+" AND "+ max + ') ';
                    else
                    cond_sql+=" or (mm.memberAge BETWEEN "+ min+" AND "+ max+ ") ";
                   }  // end of for
                     cond_sql+=')';
                    break;
                   }
            case "category":
                 {
                   y_field_list = 'offmer.categoryDesc ';
                   y_axis_array = req.body.category;
                   len_category=req.body.category.length;
                      cond_sql+=' and offmer.categoryDesc in(';
                   for (t_category=0;t_category<len_category;t_category++)
                   {
                     if (t_category==0)
cond_sql+="'"+req.body.category[t_category].name+"'";
                    else
cond_sql+=",'"+req.body.category[t_category].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                  }
            default: "segment"
               {
                 y_field_list = 'mm.memberSegment ';
                 len_seg=req.body.segment.length;
                 y_axis_array = req.body.segment;
                 cond_sql+=' and  mm.memberSegment in(';
                 for (t_seg=0;t_seg<len_seg;t_seg++)
                   {
                     if (t_seg==0)
cond_sql+="'"+req.body.segment[t_seg].name+"'";
                    else
cond_sql+=",'"+req.body.segment[t_seg].name+"'";
                  }  // end of for
                     cond_sql+=')';
                    break;
               }
         }  // end of switch
            //************************************************
            //***    SET SQL STRING
            //************************************************
              var    sqlstring  = "select " + x_field_list +" as x_value, "+ y_field_list +" as y_value ," ;
                sqlstring += "count(offres.offerSentTimestamp)as offerSent,";
                sqlstring += "count(offres.offerClicked) as offerClicked,";
                sqlstring += "count(offres.offerUsed) as offerUsed  "
                sqlstring += "from "+ constant.MEMBER_MASTER_TABLE + " mm, " + constant.OFFER_RESPONSE +" offres ," + constant.OFFER_BY_MERCHANTS + " offmer ";
                sqlstring += sqltag_details + " ";
                sqlstring += "where mm.memberId = offres.memberId ";
                sqlstring += "and ((convert(datetime,offres.offerSentTimestamp,120)) between '"+from_date+ "'  and '" +to_date + "' ) ";
                sqlstring += "and offres.offerSentTimestamp is not null " ;
                sqlstring += "and offmer.offerId = offres.offerId ";
                sqlstring += "and offmer.offerId = " + in_offerId + " ";
                sqlstring += cond_sql +" ";
                sqlstring += "group by "+x_field_list +", "+ y_field_list + " ";
                sqlstring += "order by "+x_field_list +", "+ y_field_list;+" ";


//********************************************************************
           //** create and initialize  Array matrix  with all selected X and Y Values
//*******************************************************************
            for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
             {
                 var xheader=[];
                 xheader.push({xname: x_axis_array[x_cnt].name});
                 ydata=[];
              for(y_cnt=0;y_cnt < y_axis_array.length;y_cnt++)
              {
                  ydata.push({yname: y_axis_array[y_cnt].name,
                             sent :0,
                             used :0,
                             click:0});
              }
              xheader.push({ydata});
              graph1.push({xheader});
             }
           //************************************
           //*****   Call DB API to RUN SQL
           //************************************
db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){

            if (response_data.details.length > 0)
            {

//*******************************************************
              // sumarize response data for X axis or Y axis as age_grouped
              // Special Check  for Age Group   and Gender to override DB table value with
              // X -AXIS or Y - AXIS value as DB table contains Age not Age group. Gender in DB
              // table is 'M' and 'F'. this need to be set to 'Male' 'Female'
//********************************************************
                if (age_group_Yflag=='Y' || age_group_Xflag=='Y' ||
                    gender_Yflag=='Y'    || gender_Xflag=='Y')
                {

                 for (var age=0;age<response_data.details.length;age++)
                 {
//**************************************************
                    //***   Process for Gender
//***************************************************

for(t_gender=0;t_gender<len_gender;t_gender++)
                     {
                      if ( y_axis_array[t_gender].name.substr(0, 1) == response_data.details[age].y_value)
                       {
                        response_data.details[age].y_value = y_axis_array[t_gender].name;
                       }
                      else if ( x_axis_array[t_gender].name.substr(0, 1) == response_data.details[age].x_value)
                       {
                         response_data.details[age].x_value = x_axis_array[t_gender].name;
                       }
                     }

//**************************************************
                   //***   Process for AGE Group
//***************************************************
                    if (age_group_Yflag == 'Y')
                    {
                        var detail_age =response_data.details[age].y_value;
                    }
                    else
                    {
                        var detail_age =response_data.details[age].x_value;
                    }
                     for(var t_age1=0;t_age1<len_age;t_age1++)
                     {
                         if (age_group_Yflag == 'Y')
                        {
                            var str_name1 =y_axis_array[t_age1].name;
                        }
                        else
                        {
                            var str_name1 =x_axis_array[t_age1].name;
                        }
                        var str_arr1  =str_name1.split("to");
                        var min = str_arr1[0];
                        var max = str_arr1[1];
                        var min1 = min.trim();
                        var max1 = max.trim();
                       if (detail_age >= min1 && detail_age <= max1)
                       {
                            if (age_group_Yflag == 'Y')
                            {
response_data.details[age].y_value=str_name1;
                            }
                            else
                            {
response_data.details[age].x_value=str_name1;
                            }
                      }
                    }


                 }     // end of for

                } // end of (age_group_Yflag='Y' || age_group_Xflag='Y')

                var graph=[];
                var graph_offer_sent=[];
                var graph_offer_used=[];
                var graph_offer_click=[];
                 //**********************************************
              //  UPDATE data in matrix from result set
              //***********************************************
                  for(result = 0; result<response_data.details.length;result++)
                  {

                     for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
                    {

                      for(y_cnt=0; y_cnt < y_axis_array.length;y_cnt++)
                      {


                    if ( graph1[x_cnt].xheader[0].xname == response_data.details[result].x_value &&
graph1[x_cnt].xheader[1].ydata[y_cnt].yname == response_data.details[result].y_value)
                        {
                              if (age_group_Yflag=='Y' || age_group_Xflag=='Y')
                              {
graph1[x_cnt].xheader[1].ydata[y_cnt].sent +=response_data.details[result].offerSent;
                        graph1[x_cnt].xheader[1].ydata[y_cnt].used +=response_data.details[result].offerUsed;
graph1[x_cnt].xheader[1].ydata[y_cnt].click+=response_data.details[result].offerClicked;
                              }
                             else
                                {
graph1[x_cnt].xheader[1].ydata[y_cnt].sent =response_data.details[result].offerSent;
                        graph1[x_cnt].xheader[1].ydata[y_cnt].used =response_data.details[result].offerUsed;
graph1[x_cnt].xheader[1].ydata[y_cnt].click =response_data.details[result].offerClicked;
                              }
                       }
                      }
                     }
                  }

           } // end of if (response_data.details.length > 0)
 //***************************************************
             //  format and write matrix  to send response array
             //***************************************************
            var x_axis_name =[];
            var y_array_header=[];
            var y_array_data_sent=[];
            var y_array_data_used=[];
            var y_array_data_click=[];
            for(y_cnt=0; y_cnt < y_axis_array.length;y_cnt++)
             {
                      var name_sent=y_axis_array[y_cnt].name+' Sent';
                       var name_used=y_axis_array[y_cnt].name+' Used';
                       var name_clicked=y_axis_array[y_cnt].name+' Clicked';


                y_array_data_sent=[];
                y_array_data_used=[];
                y_array_data_click=[];
              for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
              {
                   if ((graph1[x_cnt].xheader[0].xname == x_axis_array[x_cnt].name) &&
                     (graph1[x_cnt].xheader[1].ydata[y_cnt].yname == y_axis_array[y_cnt].name))
                        {
y_array_data_sent.push(graph1[x_cnt].xheader[1].ydata[y_cnt].sent );
y_array_data_used.push(graph1[x_cnt].xheader[1].ydata[y_cnt].used );
y_array_data_click.push(graph1[x_cnt].xheader[1].ydata[y_cnt].click );
                       }

              }
                 y_array_header.push(
                                       {
                                           "name" : name_sent,
                                        "data" : y_array_data_sent,
                                        "stack": "Offer Send"});
                   y_array_header.push(
                                       {"name" : name_used,
                                        "data" : y_array_data_used,
                                        "stack": "Offer Used"});
                 y_array_header.push(
                                       {"name" : name_clicked,
                                        "data" : y_array_data_click,
                                        "stack": "Offer Clicked"});

            }
           for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
                    {
x_axis_name.push(graph1[x_cnt].xheader[0].xname);


                     }
                response_data.Graph_data =[{ x_axis_name ,
                                             y_array_header

                                          }];
           if (response_data.details.length > 0)
               {      callback();
               }
                     else
                {
                    response_data.success = false;
                    response_data.message = "No data available please select more or other options.";
                    res.status(203).send({response_data});
                }


               }) // end of  DB call function

        }],function(err) {
        //    response_data.details = "";
            response_data.success = true;
            response_data.message = "select Offer Segment done OK!";
            res.status(200).send({response_data});
    });
});
module.exports = router;