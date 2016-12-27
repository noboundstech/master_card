module.exports =
{
	'validateSignin': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message =''
		if(typeof req.body.username =='undefined' || req.body.username =='' || req.body.username ==null)
		{
			error_message = "Please provide username";
			validate_success = 0;
		}
		if(typeof req.body.password =='undefined' || req.body.password =='' || req.body.password ==null)
		{
			error_message = "Please provide password";
			validate_success = 0;
		}
		if(validate_success ==0) // if validation is unsuccessful
		{
			res.status(203).send({  "status"        : false,
                                    "error_type"    : "validate error",
                                    "response_data" : {
                                                        "message"       : error_message

                                                    }
                                });
		}
		else
		{
			// if validation 
			callback();
		}
	},
    'validateForgetPassword': function(req,res,callback)          
    {
        var validate_success = 1;
        var error_message =''
        if(typeof req.body.email =='undefined' || req.body.email =='' || req.body.email ==null)
        {
            error_message = "Please enter your Email Id.";
            validate_success = 0;
        }
       
        if(validate_success ==0) // if validation is unsuccessful
        {
            res.status(203).send({  "status"        : false,
                                    "error_type"    : "validate error",
                                    "response_data" : {
                                                        "message"       : error_message

                                                    }
                                });
        }
        else
        {
            // if validation 
            callback();
        }
    },
	'validateCustomer': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message ='';

		if(req.body.search_by =='customer_id')
		{
			if(typeof req.body.wechat_id =='undefined' || req.body.wechat_id =='' || req.body.wechat_id ==null)
			{
				error_message = "Please provide customer wechat Id.";
				validate_success = 0;
			}
		}
		if(req.body.card_no =='card_no')
		{
			if(typeof req.body.card_no =='undefined' || req.body.card_no =='' || req.body.card_no ==null)
			{
				error_message = "Please provide customer card no..";
				validate_success = 0;
			}
		}
		if(validate_success ==0) // if validation is unsuccessful
		{
			res.status(203).send({	"status" 		: false,
									"error_type" 	: "validate error",
									"message" 		: error_message
								});
		}
		else
		{
			// if validation 
			callback();
		}
	},
	'validate_id': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message ='';

		
		if(typeof req.query.id =='undefined' || req.query.id =='' || req.query.id ==null)
		{
			error_message = "undefined or blank or null incoming id";
			validate_success = 0;
		}
		
		if(validate_success ==0) // if validation is unsuccessful
		{
			res.status(203).send({	"status" 		: false,
									"error_type" 	: "validate error",
									"message" 		: error_message
								});
		}
		else
		{
			// if validation 
			callback();
		}
	},
	'validate_searchtag': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message ='';

		
		if(typeof req.query.tag =='undefined' || req.query.tag =='' || req.query.tag ==null)
		{
			error_message = "undefined or blank or null incoming tag";
			validate_success = 0;
		}
		
		if(validate_success ==0) // if validation is unsuccessful
		{
			res.status(203).send({	"status" 		: false,
									"error_type" 	: "validate error",
									"message" 		: error_message
								});
		}
		else
		{
			// if validation 
			callback();
		}
	},
	'validate_tags': function(req,res,callback)          
	{
		var validate_success = 1;
		var error_message ='';
        var len= req.body.tags.length;
		if( typeof req.body.tags =='undefined' || len ==0 || req.body.tags ==null)
		//	if(typeof req.body.tags =='undefined' || len ==0 || req.query.tags ==null)
		{
			error_message = "undefined or blank or null incoming tag";
			validate_success = 0;
		}
		
		if(validate_success ==0) // if validation is unsuccessful
		{
			
			res.status(203).send({	"status" 		: false,
									"error_type" 	: "validate error",
									"message" 		: error_message
								});
		}
		else
		{
			// if validation 
			callback();
		}
	},
	'validate_fromto_dates' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
        var len_from= req.body.date_range.from.length;
        var len_to= req.body.date_range.to.length;
       
        if( typeof req.body.date_range.from =='undefined' || len_from ==0 || req.body.date_range.from ==null)

        {
            error_message = "undefined or blank or null incoming date_range From";
            validate_success = 0;
        }
        if( typeof req.body.date_range.to =='undefined' || len_to ==0 || req.body.date_range.to ==null)

        {
            error_message = "undefined or blank or null incoming date_range From";
            validate_success = 0;
        }
        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
    'MerchantOffer' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
       
        if( typeof req.body.merchant_id =='undefined' || req.body.merchant_id =='' || req.body.merchant_id ==null)

        {
            error_message = "Please Select Merchant Id.";
            validate_success = 0;
        }
        
        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
    'ValidateAddUser' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
       
        if( typeof req.body.user_role =='undefined' || req.body.user_role =='' || req.body.user_role ==null)
        {
            error_message = "Please Select User role.";
            validate_success = 0;
        }
        if( typeof req.body.password =='undefined' || req.body.password =='' || req.body.password ==null)
        {
            error_message = "Please Enter user password.";
            validate_success = 0;
        }
        if( typeof req.body.add_user_name =='undefined' || req.body.add_user_name =='' || req.body.add_user_name ==null)
        {
            error_message = "Please add user name.";
            validate_success = 0;
        }
        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({   "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
     'ValidateUpdateUser' : function(req,res,callback)         
    {
        var validate_success = 1;
        var error_message ='';
        if( typeof req.body.UserActiveStatus =='undefined' || req.body.UserActiveStatus =='' || req.body.UserActiveStatus ==null)
        {
            error_message = "Please select user active status.";
            validate_success = 0;
        }
        if( typeof req.body.userRole =='undefined' || req.body.userRole =='' || req.body.userRole ==null)
        {
            error_message = "Please Select User role.";
            validate_success = 0;
        }
        if( typeof req.body.userEMailId =='undefined' || req.body.userEMailId =='' || req.body.userEMailId ==null)
        {
            error_message = "Please Enter email Id.";
            validate_success = 0;
        }
        if( typeof req.body.userPwd =='undefined' || req.body.userPwd =='' || req.body.userPwd ==null)
        {
            error_message = "Please Enter user password.";
            validate_success = 0;
        }
        if( typeof req.body.userName =='undefined' || req.body.userName =='' || req.body.userName ==null)
        {
            error_message = "Please add user name.";
            validate_success = 0;
        }

        if(validate_success ==0) // if validation is unsuccessful
        {
           
            res.status(203).send({   "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
    'validate_offersent': function(req,res,callback)        
    {
        var validate_success = 1;
        var error_message ='';
        var memberid      = req.body.member_id,
              csrid       = req.body.csr_id,
                 id       = req.body.id,
              offerid     = req.body.offer_id;
        if( typeof id =='undefined'  || id ==''  || id ==null)

        {
            error_message = "undefined or blank or null incoming wechatid ";
            validate_success = 0;
        }
        if( typeof memberid =='undefined'  || memberid ==''  || memberid ==null)

        {
            error_message = "undefined or blank or null incoming member id ";
            validate_success = 0;
        }
         if( typeof csrid =='undefined'  || csrid ==''  || csrid ==null)

        {
            error_message = "undefined or blank or null incoming csrid ";
            validate_success = 0;
        }
        if( typeof offerid =='undefined'  || offerid ==''  || offerid ==null)
        {
            error_message = "undefined or blank or null incoming offerid ";
            validate_success = 0;
        }
    
        if(validate_success ==0) // if validation is unsuccessful
        {
          
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
    'validate_memberId': function(req,res,callback)        
    {
        var validate_success = 1;
        var error_message ='';
        var memberid      = req.body.member_id,
                  id      = req.body.id;
        if( typeof id =='undefined'  || id ==''  || id ==null)

        {
            error_message = "undefined or blank or null incoming wechatid ";
            validate_success = 0;
        }
        if( typeof memberid =='undefined'  || memberid ==''  || memberid ==null)

        {
            error_message = "undefined or blank or null incoming member id ";
            validate_success = 0;
        }
             
        if(validate_success ==0) // if validation is unsuccessful
        {
          
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
    'validate_body_id': function(req,res,callback)        
    {
        var validate_success = 1;
        var error_message ='';
        var  id      = req.body.id;
        if( typeof id =='undefined'  || id ==''  || id ==null)

        {
            error_message = "undefined or blank or null incoming wechatid ";
            validate_success = 0;
        }
                     
        if(validate_success ==0) // if validation is unsuccessful
        {
          
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
     'validate_chatdetails': function(req,res,callback)        
    {
        var validate_success = 1;
        var error_message ='';
        var len_chat= req.body.chat_details.length;
        
        if(len_chat>0)
          {
           for(row=0;row<len_chat;row++)
            {
              var memberid    = req.body.chat_details[row].member_id,
                  offerid     = 0,
                  wechatId    = req.body.chat_details[row].cust_id,
                  converseby  = req.body.chat_details[row].converseby,
                  typeofdata  = req.body.chat_details[row].typeofdata, 
                  textdata    = req.body.chat_details[row].message,
              chatheaderid    = req.body.chat_details[row].chatheaderid;

              if( typeof wechatId =='undefined'  || wechatId ==''  || wechatId ==null)
              {
               error_message = "undefined or blank or null incoming wechatid ";
               validate_success = 0;
              }
             if( typeof memberid =='undefined'  || memberid ==''  || memberid ==null)
              {
               error_message = "undefined or blank or null incoming member id ";
               validate_success = 0;
              }
              if( typeof converseby =='undefined'  || converseby ==''  || converseby ==null)
              {
               error_message = "undefined or blank or null incoming converseby ";
               validate_success = 0;
              }
               if( typeof typeofdata =='undefined'  || typeofdata ==''  || typeofdata ==null)
              {
               error_message = "undefined or blank or null incoming typeofdata ";
               validate_success = 0;
              }
               if( typeof textdata =='undefined'  || textdata ==''  || textdata ==null)
              {
               error_message = "undefined or blank or null incoming textdata ";
               validate_success = 0;
              }
              if( typeof chatheaderid  =='undefined'  || chatheaderid  ==''  || chatheaderid  ==null)
              {
               error_message = "undefined or blank or null incoming chatheaderid ";
               validate_success = 0;
              }
              var len_offer = req.body.chat_details[row].offer_details.length;
              for (offer_cnt=0; offer_cnt< len_offer;offer_cnt++)
                        {
                           offerid= req.body.chat_details[row].offer_details[offer_cnt].offer_id;
                           if( typeof offerid  =='undefined'  || offerid  ==''  || offerid  ==null)
                             {
                               error_message = "undefined or blank or null incoming offerid ";
                              validate_success = 0;
                             }
                        }   
            } // end of for
          } // end of if
             
        if(validate_success ==0) // if validation is unsuccessful
        {
          
            res.status(203).send({    "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
     'validateWeChatId': function(req,res,callback)        
    {
        var validate_success = 1;
        var error_message ='';
        var  id      = req.query.wechatid;
        if( typeof id =='undefined'  || id ==''  || id ==null)

        {
            error_message = "Please provide member Wechat Id ";
            validate_success = 0;
        }
                     
        if(validate_success ==0) // if validation is unsuccessful
        {
          
            res.status(203).send({   "status"         : false,
                                    "error_type"     : "validate error",
                                    "message"         : error_message
                                });
        }
        else
        {
            // if validation
            callback();
        }
    },
};