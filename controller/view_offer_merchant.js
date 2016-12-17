
var express = require('express'),
    router  = express.Router();
//********************************************************
router.route('/getViewList')
.get(function (req, res) {
    var async             = require('async');
    var response_data     = {};
    async.parallel([
    function(callback){
        var utils = require('utility/utils');
        utils.checkAuthentication(req,res,function(){
            callback();
        })
    },
    function(callback){
        var constant     = require("config/constant"),
            db_query     = require('db_query/query');
        //****************************************************************************
        //**** Distinct Offer Location from DB table for Response ************
        //****************************************************************************
        var    sqlstring  = "select distinct offer_address_en as name from "+ constant.OFFER_BY_MERCHANTS + ' where offer_address_en IS NOT NULL ORDER BY offer_address_en';
        db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
            response_data.offerloc = response_data.details;
            callback();
        })
    },
    function(callback){
    var constant     = require("config/constant"),
    db_query     = require('db_query/query');
    //****************************************************************************
    //**** Distinct Merchant City from DB table for Response ************
    //****************************************************************************
    var    sqlstring  = "select distinct City as name from "+ constant.MERCHANT_LOCATION + ' where City IS NOT NULL ORDER BY City';
    db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
        response_data.merchloc = response_data.details;
        callback();
    })
    },
    function(callback){
        var constant     = require("config/constant"),
        db_query     = require('db_query/query');
        //****************************************************************************
        //**** Distinct Card Type list from DB table for Response  ************
        //****************************************************************************
        var    sqlstring  = "select distinct MTRCardType as name from "+ constant.MEMBER_MASTER_TABLE + ' where MTRCardType IS NOT NULL ORDER BY MTRCardType';
        db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
           response_data.cardtype =  response_data.details;
           callback();
        })
    },
    function(callback){
        var constant     = require("config/constant"),
            db_query     = require('db_query/query');
        //****************************************************************************
        //**** Distinct CategoryDesc list from DB table for Response  ************
        //****************************************************************************
        var    sqlstring  = "select distinct categoryDesc as name from "+ constant.CATEGORY + ' where categoryDesc IS NOT NULL ORDER BY categoryDesc';
        db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
           
            response_data.category = response_data.details;
            callback();
        })
    },
    function(callback){
        var constant     = require("config/constant"),
            db_query     = require('db_query/query');
        //****************************************************************************
        //**** Distinct Merchant id /name list from DB table for Response  ************
        //****************************************************************************
        var    sqlstring  = "select distinct merchantName as name ,merchantId as id from "+ constant.OFFER_BY_MERCHANTS + ' where merchantName IS NOT NULL ORDER BY merchantName';
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
    db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
        var len_subcate=response_data.details.length;
        response_data.subcategory = response_data.details;
        callback();
    })

    }],function(err) {
        response_data.details = "";
        response_data.success = true;
        response_data.message = "select offer Loction ,MTRCardType,categoryDesc,subcategoryDesc done OK!";
        res.status(200).send({response_data});
    });
});

router.route('/getOfferView')
.post(function (req, res) {
    var async           = require('async'),
        constant        = require("config/constant");
        response_data   = {},
        from_date       = "",
        to_date         = "";

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
                //******************************************************************************
                //*********  check Card Type filter condition  and Add to SQL Variable
                //******************************************************************************
                if( typeof req.body.card_type !='undefined' && req.body.card_type !='' && req.body.card_type !=null)
                {
                    len_card=req.body.card_type.length;
                    if (len_card  > 0)
                    {
                        cond_sql+='and (';
                        for (t_card=0;t_card<len_card;t_card++)
                        {
                            if (t_card==0)
                            cond_sql+=' offmer.'+req.body.card_type[t_card].name.replace(" ","")+"=1";
                            else
                            cond_sql+=' or offmer.'+req.body.card_type[t_card].name+"=1";

                        }  // end of for
                        cond_sql+=')';
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
                        cond_sql+="'"+req.body.location[t_loc].name+"'";
                        else
                        cond_sql+=",'"+req.body.location[t_loc].name+"'";
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
                            cond_sql+="'"+req.body.category[t_cate].name+"'";
                        else
                            cond_sql+=",'"+req.body.category[t_cate].name+"'";
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
                            cond_sql+="'"+req.body.subcategory[t_subcate].name+"'";
                        else
                            cond_sql+=",'"+req.body.subcategory[t_subcate].name+"'";
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
                            cond_sql+="'"+req.body.merchant_details[t_merch].id+"'";
                        else
                            cond_sql+=",'"+req.body.merchant_details[t_merch].id+"'";
                    }  // end of for
                    cond_sql+=')';
                }
            }

            //************************************************
            //***    SET SQL STRING
            //************************************************
            var sqlstring  = "select "  ;
                sqlstring += "offmer.OfferId,offmer.MerchantId,offmer.merchantName,offmer.CategoryDesc,offmer.subCategoryDesc,";
                sqlstring += "offmer.Offer_rule_en,offmer.benefit_name_en,offmer.offer_address_en,offmer.postal_code ";
                sqlstring += "from "+ constant.OFFER_BY_MERCHANTS + " offmer " ;
                sqlstring += "where ";
                sqlstring += "((convert(datetime,offmer.up_time,120)) >= '"+from_date+ "'  and "
                sqlstring += "(convert(datetime,offmer.expired_date,120)) <= '" + to_date + "' ) ";
                sqlstring += "and offmer.up_time is not null " ;
                sqlstring += cond_sql +" ";
                sqlstring += "order by MerchantId,merchantName " ;
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
            response_data.message = "select Offer view done OK!";
            res.status(200).send({response_data});
    });
});

router.route('/getMerchantView')
.post(function (req, res) {
    var async       = require('async'),
    constant        = require("config/constant");
    response_data   = {},
    from_date       = "",
    to_date         = "";
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
            t_merch         = 0;
        //******************************************************************************
        //*********  check Card Type filter condition  and Add to SQL Variable
        //******************************************************************************
        if( typeof req.body.card_type !='undefined' && req.body.card_type !='' && req.body.card_type !=null)
        {   
            len_card=req.body.card_type.length;
            if (len_card  > 0) 
            { 
                cond_sql+='and (';
                for (t_card=0;t_card<len_card;t_card++)
                {
                    if (t_card==0)  
                        cond_sql+='  offmer.'+req.body.card_type[t_card].name+"=1";
                    else
                        cond_sql+=' or offmer.'+req.body.card_type[t_card].name+"=1";  
                }  // end of for
                cond_sql+=')';
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
                cond_sql+="'"+req.body.location[t_loc].name+"'";
                else
                cond_sql+=",'"+req.body.location[t_loc].name+"'";
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
                    cond_sql+="'"+req.body.category[t_cate].name+"'";
                    else
                    cond_sql+=",'"+req.body.category[t_cate].name+"'";
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
            cond_sql+="'"+req.body.subcategory[t_subcate].name+"'";
            else
            cond_sql+=",'"+req.body.subcategory[t_subcate].name+"'";
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
                            cond_sql+="'"+req.body.merchant_details[t_merch].id+"'";
                        else
                            cond_sql+=",'"+req.body.merchant_details[t_merch].id+"'";
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
                    cond_sql+="'"+req.body.merchant_location[t_merch].name+"'";
                    else
                    cond_sql+=",'"+req.body.merchant_location[t_merch].name+"'";
                }  // end of for
                cond_sql+=')';
            }
        }

        //************************************************
        //***    SET SQL STRING
        //************************************************
        var sqlstring  = "select "  ;
            sqlstring += "offmer.MerchantId,offmer.merchantName,mloc.LocationName,mloc.LocationAddress1,mloc.City,";
            sqlstring += "offmer.CategoryDesc,offmer.subCategoryDesc , offmer.offer_address_en " 
            sqlstring += "from "+ constant.OFFER_BY_MERCHANTS + " offmer " ;
            sqlstring += "INNER JOIN " +constant. MERCHANT_LOCATION + " mloc on offmer.merchantId= mloc.merchantId "
            sqlstring += "where offmer.merchantName is NOT NULL ";
            sqlstring += cond_sql +" ";
            sqlstring += "order by merchantName " ;
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
});
module.exports = router;
