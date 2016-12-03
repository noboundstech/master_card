var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();
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
            var sqltag='';
        //*********  check x  and y field name add
        switch(x_field)
        {
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
                   x_field_list = 'mm.memberGender ';
                   cond_sql=' and (mm.memberGender =';
                    len_gender=req.body.gender.length;
                 for (t_gender=0;t_gender<len_gender;t_gender++)
                   {
                     if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name+"'";
                    else
                    cond_sql+=" or '"+req.body.gender[t_gender].name+"'";
                   }  // end of for
                      cond_sql+=')';
                     break;
            case "location_details":
                   x_field_list = 'mm.City ';
                   x_axis_array = req.body.location_details;
                   len_city=req.body.location_details.length;
                      cond_sql=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location_details[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location_details[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
            case "tags":
                    x_field_list = 'tm.tagDesc ';
                    x_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                    cond_sql =' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in( ';
                    sqltag='tMemberTags memtag , tTagMaster tm';
                  for (t_tag=0;t_tag<len_tag;t_tag++)
                   {
                     if (t_tag==0)
cond_sql+="'"+req.body.location_details[t_tag].name+"'";
                    else
cond_sql+=",'"+req.body.location_details[t_tag].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
            case "age_grouped":
                   x_field_list = 'mm.memberAge';
                   x_axis_array = req.body.age_grouped;
                   len_age=req.body.age_grouped.length;
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
        sqltag=' ';
         switch(y_field)
        {
            case "segment":
                {
                 y_field_list = 'mm.memberSegment ';
                 y_axis_array = req.body.segment;
                 len_seg=req.body.segment.length;
                 cond_sql=' and  mm.memberSegment in(';
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
                   cond_sql=' and (mm.memberGender =';
                    len_gender=req.body.gender.length;
                 for (t_gender=0;t_gender<len_gender;t_gender++)
                   {
                     if (t_gender==0)
cond_sql+="'"+req.body.gender[t_gender].name+"'";
                    else
                    cond_sql+=" or '"+req.body.gender[t_gender].name+"'";
                   }  // end of for
                      cond_sql+=')';
                     break;
                   }
            case "location_details":
                 {
                   y_field_list = 'mm.City ';
                   y_axis_array = req.body.location_details;
                   len_city=req.body.location_details.length;
                      cond_sql=' and mm.City in(';
                   for (t_city=0;t_city<len_city;t_city++)
                   {
                     if (t_city==0)
cond_sql+="'"+req.body.location_details[t_city].name+"'";
                    else
cond_sql+=",'"+req.body.location_details[t_city].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                  }
            case "tags":
                  {
                    y_field_list = 'tm.tagDesc ';
                    y_axis_array = req.body.tags;
                    len_tag=req.body.tags.length;
                   cond_sql =' and mm.memberId = memtag.memberId and memtag.tagId = tm.tagId and tm.tagDesc in( ';
                    sqltag='tMemberTags memtag , tTagMaster tm';

                  for (t_tag=0;t_tag<len_tag;t_tag++)
                   {
                     if (t_tag==0)
						cond_sql+="'"+req.body.location_details[t_tag].name+"'";
						                    else
						cond_sql+=",'"+req.body.location_details[t_tag].name+"'";
                   }  // end of for
                     cond_sql+=')';
                    break;
                   }
            case "age_grouped":
                  {
                   y_field_list = 'mm.memberAge';
                   len_age=req.body.age_grouped.length;
                   y_axis_array = req.body.age_grouped;
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
                 cond_sql=' and  mm.memberSegment in(';
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


               var    sqlstring  = "select " + x_field_list +" as x_value, "+ y_field_list +" as y_value ," ;
                sqlstring += "count(offres.offerSentTimestamp)as offerSent,";
                sqlstring += "count(offres.offerClicked) as offerClicked,";
                sqlstring += "count(offres.offerUsed) as offerUsed  "
                sqlstring += "from tmemberMaster mm, tOfferResponse offres ";
                sqlstring += "where mm.memberId = offres.memberId ";
                sqlstring += sqltag;
                sqlstring += "and ((convert(datetime,offres.offerSentTimestamp,120)) between '"+from_date+ "'  and '" +to_date + "' ) ";
                sqlstring += "and offres.offerSentTimestamp is not null " ;
                sqlstring += cond_sql +" ";
                sqlstring += "group by "+x_field_list +", "+ y_field_list
                sqlstring += "order by "+x_field_list +", "+ y_field_list;

		db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){

            if (response_data.details.length > 0)
            {
                 //var response = [];
                var graph=[];
                var graph_offer_sent=[];
                var graph_offer_used=[];
                var graph_offer_click=[];

                 for(x_cnt=0;x_cnt < x_axis_array.length;x_cnt++)
                 {
                 //    var graph_offer_sent_det=[];
                //    var graph_offer_used_det=[];
                //    var graph_offer_click_det=[];
                  for(result = 0; result<response_data.details.length;result++)

                    {
                         for(y_cnt=0;y_cnt < y_axis_array.length;y_cnt++)
                         {
                             if(x_axis_array[x_cnt].name == response_data.details[result].x_value && y_axis_array[y_cnt].name == response_data.details[result].y_value)
                             {

                                 graph_offer_sent.push({
                                                         name : y_axis_array[x_cnt].name,
                                                         value : response_data.details[result].offerSent
                                                         });
                                 graph_offer_used.push({
                                                         name : y_axis_array[x_cnt].name,
                                                         value : response_data.details[result].offerUsed});
                                 graph_offer_click.push({
                                                         name : y_axis_array[x_cnt].name,
                                                         value : response_data.details[result].offerClicked});

                             }
                         } // end of for
                    }
                //    graph_offer_sent=graph_offer_sent_det;
               //     graph_offer_used=graph_offer_sent_det;
                //    graph_offer_click=graph_offer_sent_det;
                } // end of for

                    response_data.aaaa ={
                        "Graph" : graph,
                        "det"  : [{graph_offer_sent},
                                      {graph_offer_used},
                                      {graph_offer_click}
                                     ]
                               };
                 callback();
            } // end of if

            else
                {
                    response_data.success = false;
                    response_data.message = "MemberId row not present in DB table.";
                    res.status(203).send({response_data});
                }
            })

        }],function(err) {
        //    response_data.details = "";
            response_data.success = true;
            response_data.message = "select Customer Segment done OK!";
            console.log(response_data)
            res.status(200).send({response_data});
    });
});

module.exports = router;