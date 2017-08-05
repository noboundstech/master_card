
var express = require('express'),
    utils   = require('utility/utils'),
    router  = express.Router();
var queryList = {};
//********************************************************
router.route('/getViewList')
.get(function (req, res) {
    var async             = require('async');
    var response_data     = {};

	varqueryList = {};
    try{
        async.parallel([
        function(callback){
            
            utils.checkAuthentication(req,res,function(){
                callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
                db_query     = require('db_query/query');
                 console.log("2");
            //****************************************************************************
            //**** Distinct Offer Location from DB table for Response ************
            //****************************************************************************
            var    sqlstring  = "select distinct offer_address_en as name from "+ constant.OFFER_BY_MERCHANTS + ' where offer_address_en IS NOT NULL ORDER BY offer_address_en';
            queryList.districtCity = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                response_data.offerloc = response_data.details;
                callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
            db_query     = require('db_query/query');
             console.log("3");
            //****************************************************************************
            //**** Distinct Merchant City from DB table for Response ************
            //****************************************************************************
            var    sqlstring  = "select distinct City as name from "+ constant.MERCHANT_LOCATION + ' where City IS NOT NULL ORDER BY City';
            queryList.distinctMerchantCity = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                response_data.merchloc = response_data.details;
                callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
            db_query     = require('db_query/query');
             console.log("4");
            //****************************************************************************
            //**** Distinct Card Type list from DB table for Response  ************
            //****************************************************************************
            var    sqlstring  = "select distinct MTRCardType as name from "+ constant.MEMBER_MASTER_TABLE + ' where MTRCardType IS NOT NULL ORDER BY MTRCardType';
           queryList.distinctCity = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
               response_data.cardtype =  response_data.details;
               callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
                db_query     = require('db_query/query');
                 console.log("5");
            //****************************************************************************
            //**** Distinct CategoryDesc list from DB table for Response  ************
            //****************************************************************************
            var    sqlstring  = "select distinct categoryDesc as name from "+ constant.CATEGORY + ' where categoryDesc IS NOT NULL ORDER BY categoryDesc';
            queryList.distinctCategoly = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
               
                response_data.category = response_data.details;
                callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
                db_query     = require('db_query/query');
                 console.log("6");
            //****************************************************************************
            //**** Distinct Merchant id /name list from DB table for Response  ************
            //****************************************************************************
            var    sqlstring  = "select distinct merchantName as name ,merchantId as id from "+ constant.OFFER_BY_MERCHANTS + ' where merchantName IS NOT NULL ORDER BY merchantName';
            queryList.distinctMerchatNameAndId = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                response_data.merchant_details = response_data.details;
                callback();
            })
        },
        function(callback){
            var constant     = require("config/constant"),
            db_query     = require('db_query/query');
            //****************************************************************************
            //**** Distinct Subcategory list from DB table for Response ************
            //****************************************************************************
            var    sqlstring  = "select distinct subCategoryDesc as name from "+ constant.SUBCATEGORY + ' where subCategoryDesc IS NOT NULL ORDER BY subCategoryDesc';
            queryList.distinctSubcategory = sqlstring;
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                var len_subcate=response_data.details.length;
                response_data.subcategory = response_data.details;
                callback();
            })

        }],function(err) {
            response_data.details = "";
            response_data.success = true;
            response_data.queryList = queryList;
            response_data.message = "select offer Loction ,MTRCardType,categoryDesc,subcategoryDesc done OK!";
            res.status(200).send({response_data});
        });
 
    }catch(err)
    {
        res.status(502).send({err});
    }
   
});

router.route('/getOfferView')
.post(function (req, res) {
    // was post method
   // req.body        = req.query;

    var async           = require('async'),
        constant        = require("config/constant");
        response_data   = {},
        from_date       = "",
        to_date         = "";
        var queryList   = {};
    try{
        async.series([
            function(callback) {
                var validate = require('utility/validate');
                validate.validate_fromto_dates(req,res,function(){
                from_date       = req.body.date_range.from,
                to_date         = req.body.date_range.to;
                    callback();
                })
            },
            function(callback){
                var utils = require('utility/utils');
                utils.checkAuthentication(req,res,function(){
                    callback();
                })
            },
            function(callback) {

                var cond_sql        = '',
                    db_query        = require('db_query/query'),
                    len_cate        = 0,
                    len_card        = 0,
                    len_subcate     = 0,
                    len_loc         = 0,
                    len_merch       = 0,
                    t_card          = 0,
                    t_cate          = 0,
                    t_subcate       = 0,
                    t_loc           = 0,
                    t_merch         = 0;
                var cardTypeQuery   = '';
                var cardMasterTable = '';
                var cardTypeCondition = '';
                    //******************************************************************************
                    //*********  check Card Type filter condition  and Add to SQL Variable
                    //******************************************************************************
                    if( typeof req.body.card_type !='undefined' && req.body.card_type !='' && req.body.card_type !=null)
                    {
                        len_card=req.body.card_type.length;
                        if (len_card  > 0)
                        {
                            cardMasterTable = ',tofferCardTypes cardtype,tcardtypemaster cardm  ';

                            cardTypeCondition= ' and offmer.offerid = cardtype.offerid and cardtype.cardtypeid = cardm.cardtypeid';

                            cardTypeQuery = 'AND  cardm.cardtypedesc in (';
                           
                            for (t_card=0;t_card<len_card;t_card++)
                            {
                               
                                cardTypeQuery+="'"+req.body.card_type[t_card].name.replace(" ","")+"'";
                                
                                if(t_card!=len_card-1)
                                {
                                     cardTypeQuery+=",";
                                }
                            }  // end of for
                            cardTypeQuery+=') ';
                        }
                    }

                //******************************************************************************
                            //*********  check Location filter condition  and Add to SQL Variable
                //******************************************************************************
                if(typeof req.body.location !='undefined' && req.body.location !='' && req.body.location !=null)
                {
                    len_loc     = req.body.location.length;
                    if (len_loc > 0 )
                    {
                        cond_sql+=' and offmer.offer_address_en in(';
                        for (t_loc=0;t_loc<len_loc;t_loc++)
                        {
                            if (t_loc==0)
                            cond_sql+="'"+utils.mssql_real_escape_string(req.body.location[t_loc].name)+"'";
                            else
                            cond_sql+=",'"+utils.mssql_real_escape_string(req.body.location[t_loc].name)+"'";
                        }  // end of for
                        cond_sql+=')';
                    }
                }
                //******************************************************************************
                //*********  check Category filter condition  and Add to SQL Variable
                //******************************************************************************
                if( typeof req.body.category !='undefined' && req.body.category !='' && req.body.category !=null)
                {
                    len_cate     = req.body.category.length;
                    if (len_cate > 0 )
                    {
                        cond_sql+=' and offmer.CategoryDesc in(';
                        for (t_cate=0;t_cate<len_cate;t_cate++)
                        {
                            if (t_cate==0)
                                cond_sql+="'"+utils.mssql_real_escape_string(req.body.category[t_cate].name)+"'";
                            else
                                cond_sql+=",'"+utils.mssql_real_escape_string(req.body.category[t_cate].name)+"'";
                        }  // end of for
                        cond_sql+=')';
                    }
                }
                //******************************************************************************
                //*********  check SUbCategory filter condition  and Add to SQL Variable
                //******************************************************************************
                if( typeof req.body.subcategory !='undefined' && req.body.subcategory !='' && req.body.subcategory !=null)
                {
                    len_subcate     = req.body.subcategory.length;
                    if (len_subcate > 0 )
                    {
                        cond_sql+=' and offmer.SubCategoryDesc in(';
                        for (t_subcate=0;t_subcate<len_subcate;t_subcate++)
                        {
                            if (t_subcate==0)
                                cond_sql+="'"+utils.mssql_real_escape_string(req.body.subcategory[t_subcate].name)+"'";
                            else
                                cond_sql+=",'"+utils.mssql_real_escape_string(req.body.subcategory[t_subcate].name)+"'";
                        }  // end of for
                        cond_sql+=')';
                    }
                }
                //******************************************************************************
                //*********  check SUbCategory filter condition  and Add to SQL Variable
                //******************************************************************************
                if( typeof req.body.merchant_details !='undefined' && req.body.merchant_details !='' && req.body.merchant_details !=null)
                {
                    len_merch     = req.body.merchant_details.length;
                    if (len_merch > 0 )
                    {
                        cond_sql+=' and offmer.merchantId in(';
                        for (t_merch=0;t_merch < len_merch;t_merch++)
                        {
                            if (t_merch==0)
                                cond_sql+="'"+utils.mssql_real_escape_string(req.body.merchant_details[t_merch].id)+"'";
                            else
                                cond_sql+=",'"+utils.mssql_real_escape_string(req.body.merchant_details[t_merch].id)+"'";
                        }  // end of for
                        cond_sql+=')';
                    }
                }

                //************************************************
                //***    SET SQL STRING
                //************************************************
                var sqlstring  = "select "  ;
                    sqlstring += " offmer.OfferId,offmer.MerchantId,offmer.merchantName,offmer.CategoryDesc,offmer.subCategoryDesc,";
                    sqlstring += " offmer.Offer_rule_en,offmer.benefit_name_en,offmer.offer_address_en,offmer.postal_code ";
                    sqlstring += " from "+ constant.OFFER_BY_MERCHANTS + " offmer "+cardMasterTable ;
                    sqlstring += " where ";
                    sqlstring += " ((convert(datetime,offmer.up_time,120)) >= '"+from_date+ "'  and "
                    sqlstring += " (convert(datetime,offmer.expired_date,120)) <= '" + to_date + "' ) ";
                    sqlstring += " and offmer.up_time is not null "+cardTypeQuery ;
                    sqlstring += cond_sql +" "+cardTypeCondition+" ";
                    sqlstring += " order by MerchantId,merchantName " ;

                //************************************
                //*****   Call DB API to RUN SQL
                //************************************
                queryList.getOfferView = sqlstring;
                response_data.queryList = queryList;
                db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){

                    if (response_data.details.length > 0)
                    {
                        callback();
                    }
                    else
                    {
                        response_data.success = false;
                        response_data.message = "No data available please select more or other options.";
                        res.status(203).send({response_data});
                    }
                }) // end of  DB call function
            }],function(err) {
                response_data.success = true;

                response_data.message = "select Offer view done OK!";
                res.status(200).send({response_data});
        });
    }catch(err)
    {
        res.status(502).send({err});
    }
});

router.route('/getMerchantView')
.post(function (req, res) {
    // was post method
   // req.body        = req.query;
    var async       = require('async'),
    constant        = require("config/constant"),
    response_data   = {},
    from_date       = "",
    to_date         = "";
    var queryList   = {};
    try{
        async.series([
        function(callback){
            var utils = require('utility/utils');
            utils.checkAuthentication(req,res,function(){
                callback();
            })
        },
        function(callback) {
            var cond_sql        = '',
                db_query        = require('db_query/query'),
                len_cate        = 0,
                len_card        = 0,
                len_subcate     = 0,
                len_loc         = 0,
                len_merch       = 0,
                t_card          = 0,
                t_cate          = 0,
                t_subcate       = 0,
                t_loc           = 0,
                t_merch         = 0,
                cardTypeQuery   = '',
                cardTypeWhere   = '';
            var cardTypeQuery   = '';
            var cardMasterTable = '';
            var cardTypeCondition = '';
            //******************************************************************************
            //*********  check Card Type filter condition  and Add to SQL Variable
            //******************************************************************************
            if( typeof req.body.card_type !='undefined' && req.body.card_type !='' && req.body.card_type !=null)
            {   
                len_card=req.body.card_type.length;
                if (len_card  > 0) 
                { 



                    cardMasterTable = ',tofferCardTypes cardtype,tcardtypemaster cardm  ';

                    cardTypeCondition= ' and offmer.offerid = cardtype.offerid and cardtype.cardtypeid = cardm.cardtypeid';

                    cardTypeQuery = 'AND  cardm.cardtypedesc in (';
                   
                    for (t_card=0;t_card<len_card;t_card++)
                    {
                       
                        cardTypeQuery+="'"+req.body.card_type[t_card].name.replace(" ","")+"'";
                        
                        if(t_card!=len_card-1)
                        {
                             cardTypeQuery+=",";
                        }
                    }  // end of for
                    cardTypeQuery+=') ';
                    
                }
            }   
            //******************************************************************************
            //*********  check Location filter condition  and Add to SQL Variable
            //******************************************************************************     
            if( typeof req.body.location !='undefined' && req.body.location !='' && req.body.location !=null)
            {  
                len_loc     = req.body.location.length;
                if (len_loc > 0 )
                {   
                    cond_sql+=' and offmer.offer_address_en in(';
                    for (t_loc=0;t_loc<len_loc;t_loc++)
                    {
                    if (t_loc==0)
                    cond_sql+="'"+utils.mssql_real_escape_string(req.body.location[t_loc].name)+"'";
                    else
                    cond_sql+=",'"+utils.mssql_real_escape_string(req.body.location[t_loc].name)+"'";
                    }  // end of for
                    cond_sql+=')';
                }
            }  
            //******************************************************************************
            //*********  check Category filter condition  and Add to SQL Variable
            //******************************************************************************         
            if( typeof req.body.category !='undefined' && req.body.category !='' && req.body.category !=null)
            {    
                len_cate     = req.body.category.length;
                if (len_cate > 0 )
                {    
                    cond_sql+=' and offmer.CategoryDesc in(';
                    for (t_cate=0;t_cate<len_cate;t_cate++)
                    {
                        if (t_cate==0)
                        cond_sql+="'"+utils.mssql_real_escape_string(req.body.category[t_cate].name)+"'";
                        else
                        cond_sql+=",'"+utils.mssql_real_escape_string(req.body.category[t_cate].name)+"'";
                    }  // end of for
                    cond_sql+=')';
                }
            }
            //******************************************************************************
            //*********  check SUbCategory filter condition  and Add to SQL Variable
            //****************************************************************************** 
            if( typeof req.body.subcategory !='undefined' && req.body.subcategory !='' && req.body.subcategory !=null)
            {           
                len_subcate     = req.body.subcategory.length;
                if (len_subcate > 0 )
                {    
                cond_sql+=' and offmer.SubCategoryDesc in(';
                for (t_subcate=0;t_subcate<len_subcate;t_subcate++)
                {
                if (t_subcate==0)
                cond_sql+="'"+utils.mssql_real_escape_string(req.body.subcategory[t_subcate].name)+"'";
                else
                cond_sql+=",'"+utils.mssql_real_escape_string(req.body.subcategory[t_subcate].name)+"'";
                }  // end of for
                cond_sql+=')';
                }
            }  
            //******************************************************************************
            //*********  check SUbCategory filter condition  and Add to SQL Variable
            //****************************************************************************** 



             if( typeof req.body.merchant_details !='undefined' && req.body.merchant_details !='' && req.body.merchant_details !=null)
                {
                    len_merch     = req.body.merchant_details.length;
                    if (len_merch > 0 )
                    {
                        cond_sql+=' and offmer.merchantId in(';
                        for (t_merch=0;t_merch < len_merch;t_merch++)
                        {
                            if (t_merch==0)
                                cond_sql+="'"+utils.mssql_real_escape_string(req.body.merchant_details[t_merch].id)+"'";
                            else
                                cond_sql+=",'"+utils.mssql_real_escape_string(req.body.merchant_details[t_merch].id)+"'";
                        }  // end of for
                        cond_sql+=')';
                    }
                }
            if( typeof req.body.merchant_location !='undefined' && req.body.merchant_location !='' && req.body.merchant_location !=null)
            {         
                len_merch     = req.body.merchant_location.length;
                if (len_merch > 0 )
                { 
                    cond_sql+=' and mloc.City in(';
                    for (t_merch=0;t_merch < len_merch;t_merch++)
                    {
                        if (t_merch==0)
                        cond_sql+="'"+utils.mssql_real_escape_string(req.body.merchant_location[t_merch].name)+"'";
                        else
                        cond_sql+=",'"+utils.mssql_real_escape_string(req.body.merchant_location[t_merch].name)+"'";
                    }  // end of for
                    cond_sql+=')';
                }
            }

            //************************************************
            //***    SET SQL STRING


            //************************************************
            var sqlstring  = "select "  ;
                sqlstring += " offmer.MerchantId, offmer.merchantName, mloc.LocationName, mloc.LocationAddress1, mloc.City, offmer.CategoryDesc,";
                sqlstring += " offmer.subCategoryDesc, offmer.offer_address_en " 
                sqlstring += " from "+ constant.OFFER_BY_MERCHANTS + " offmer " ;
                sqlstring += ", " +constant.MERCHANT_LOCATION + " mloc  "+cardMasterTable+" ";
                sqlstring += " where offmer.merchantName is NOT NULL "+cardTypeQuery+" ";
                sqlstring += cond_sql +" "+cardTypeCondition+" AND offmer.merchantid = mloc.merchantid";
                sqlstring += " order by merchantName " ;

            queryList.merchantView = sqlstring;
            response_data.queryList = queryList
            //************************************
            //*****   Call DB API to RUN SQL
            //************************************
            db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){

                if (response_data.details.length > 0)
                {
                 callback();
                } 
                else
                {
                    response_data.success = false;
                    response_data.message = "No data available please select more or other options.";
                    res.status(203).send({response_data});
                }
            }) // end of  DB call function
        }],function(err) {
            response_data.success = true;
            response_data.message = "select Merchant view done OK!";
            res.status(200).send({response_data});
        });

    
    
    }catch(err)
    {
        res.status(502).send({err});
    }
});
module.exports = router;
