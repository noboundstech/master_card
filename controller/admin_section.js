var express = require('express'),
    app     = express(),
    utils = require('utility/utils');
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
   // was post method
  //  req.body        = req.query;

    var async         = require('async');
    var utils       = require('utility/utils'),
         db_query     = require('db_query/query'),
        constant     = require("config/constant");
    var response_data = {};

    try{


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
                var    selection     = '*',
                    table        = constant.USER_MASTER_TABLE;
                var condition   = [{
                                    "name"     : "userName",
                                    "type"    : constant.VARCHAR50,
                                    "value"    : req.body.add_user_name
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
            function(callback){

                var    selection     = '*',
                    table        = constant.USER_MASTER_TABLE;
                var condition   = [{
                                    "name"     : "userEMailId",
                                    "type"    : constant.VARCHAR100,
                                    "value"    : req.body.email_id
                                }];
                db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
                    if(response_data.details.length>0)
                    {
                        response_data.success = false;
                        response_data.message = "Email Id Already Exist.";
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
                                "name"         : "userName",
                                "type"        : constant.VARCHAR50,
                                "varname"     : "user_name",
                                "value"        : req.body.add_user_name
                            },{
                                "name"         : "userPwd",
                                "type"        : constant.VARCHAR50,
                                "varname"     : "user_password",
                                "value"        : req.body.password
                            },{
                                "name"         : "userRole",
                                "type"        : constant.VARCHAR5,
                                "varname"     : "user_role",
                                "value"        : req.body.user_role
                            },{
                                "name"         : "userEMailId",
                                "type"        : constant.VARCHAR100,
                                "varname"     : "userEMailId",
                                "value"        : req.body.email_id
                            },{
                                "name"         : "UserActiveStatus",
                                "type"        : constant.VARCHAR1,
                                "varname"     : "active_status",
                                "value"        : "Y"
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
    }catch(err)
    {
        res.status(502).send({err});
    }
});
router.route('/updateUserDetails')
.post(function (req, res) {
    // was post method
    //req.body        = req.query;

    var async         = require('async');
    var utils       = require('utility/utils'),
         db_query     = require('db_query/query'),
        constant     = require("config/constant");
    var response_data = {};
    try{
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
                var    selection     = '*',
                    table        = constant.USER_MASTER_TABLE;
                var condition   = [{
                                    "name"     : "userName",
                                    "type"    : constant.VARCHAR50,
                                    "value"    : req.body.userName
                                }];
                db_query.selectFromDb(req,res,condition,selection,table,response_data,function(){
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
            function(callback){

                var    selection     = '*',
                    table        = constant.USER_MASTER_TABLE;
                var emailid = req.body.userEMailId,
                  user_name = req.body.userName ;
                sqlstring= "select  "+    selection + " from    "+ table +" where userEMailId='" +emailid +"' and userName<>'"+ utils.mssql_real_escape_string(user_name)+ "'";
                db_query.RunSelSqlFromDb(req,res,sqlstring,response_data,function(){
                    if(response_data.details.length > 0)
                    {
                        response_data.success = false;
                        response_data.message = "This Email Id Already exist. Please enter a new one";
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
                var fieldlist  = [{
                                "name"         : "userPwd",
                                "type"        : constant.VARCHAR50,
                                "varname"     : "user_password",
                                "value"        : req.body.userPwd
                            },{
                                "name"         : "userRole",
                                "type"        : constant.VARCHAR5,
                                "varname"     : "user_role",
                                "value"        : req.body.userRole
                            },{
                                "name"         : "userEMailId",
                                "type"        : constant.VARCHAR100,
                                "varname"     : "userEMailId",
                                "value"        : req.body.userEMailId
                            },{
                                "name"         : "UserActiveStatus",
                                "type"        : constant.VARCHAR1,
                                "varname"     : "active_status",
                                "value"        : req.body.UserActiveStatus
                            }];
                 var condition   = [{
                                    "name"     : "userId",
                                    "type"    : constant.SMINT,
                                    "value"    : req.body.userId
                                }];
                db_query.updateToDb(req,res,condition,fieldlist,table,response_data,function(){
                    callback();
                });
        }],function(err) {
            response_data.success = true;
            response_data.message = "User Updated Successfully.!";
            res.status(200).send({response_data});
        });
    }catch(err)
    {
        res.status(502).send({err});
    }
});
module.exports = router;
