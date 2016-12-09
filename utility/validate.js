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
		console.log('validate len :',len);
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
    }
};