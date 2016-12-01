module.exports = {
	'selectFromDb': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);
			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			var query = 'select '+selection+' FROM dbo.'+table+' '+where;
		   	request.query(query).then(function(recordset) {
	    		data.details = recordset;
	    		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	},

	'RunSelSqlFromDb': function(req,res,sqlstring,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);

			var request = new sql.Request(connection1); // or: var request = connection1.request();
		
			var query = sqlstring ;
		    //request.query('SELECT '+selection+' FROM '+table+'where userId=1').then(function(recordset) {
		   //request.query('SELECT '+selection+' FROM '+table+' where '+condition).then(function(recordset) {
		   	request.query(query).then(function(recordset) {
        		data.details = recordset;
            		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		    
		});
	
	},
	'insertToDb': function(req,res,condition,fieldlist,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}

			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);

			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			var vallist= '(';
			var flist='(';
			for(i=0;i<fieldlist.length;i++)
			{
				
				var type2 = utils.getTableColumnType(sql,fieldlist[i].type);
			   	request.input(fieldlist[i].varname,type2,fieldlist[i].value);
			   	vallist+="@"+fieldlist[i].varname;
			    flist+=fieldlist[i].name;
			    if(i< fieldlist.length-1)
				{
					flist+= ",";
					vallist+= ",";
				}
			}
	
			var query = 'insert into '+table+' '+flist+') values'+vallist +') '+where;

		   	request.query(query).then(function(recordset) {
		    
	        	data.details = request.rowsAffected;
         
	    		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	},
	'updateToDb': function(req,res,condition,fieldlist,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
				
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
		
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);

			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			var flist='';
			for(i=0;i<fieldlist.length;i++)
			{
				
											   
			   	if (fieldlist[i].varname != "SYSDATETIME()")
                 {
                   var type2 = utils.getTableColumnType(sql,fieldlist[i].type);	
  
                   request.input(fieldlist[i].varname,type2,fieldlist[i].value);	
			       flist+=fieldlist[i].name +'='+ "@"+fieldlist[i].varname;
			     }  
			    else  
			     {	

			        flist+=fieldlist[i].name +'='+fieldlist[i].varname;
			     }   
			    if(i< fieldlist.length-1)
				{
					flist+= ",";
				}
			}
		
			var query = 'update '+table+' set '+flist+' '+where;
		   	request.query(query).then(function(recordset) {
		    
	    		data.details = request.rowsAffected;
	    
              		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	},
	'deleteFromDb': function(req,res,condition,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var utils = require('utility/utils');
		var connection1 = new sql.Connection(config, function(err) {
			//console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			if(condition.length>0)
			{
				var where = ' WHERE ';
			}
			else
			{
				var where = '';
			}
			for(i=0;i<condition.length;i++)
			{
				
				var type = utils.getTableColumnType(sql,condition[i].type);

			   	request.input(condition[i].name,type,condition[i].value);
			    where+=" "+condition[i].name +" = @"+condition[i].name;
				if(i<condition.length-1)
				{
					where+= " AND ";
				}
			}
			
			var query = 'delete from '+table+' '+ where;

		   	request.query(query).then(function(result) {
		    
	    		data.details = result;
	    		callback();
	    		connection1.close();
		    }).catch(function(err) {
		    	console.log(err)
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
		});
	},
/*
	'searchByMerchant': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select '+selection+' from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and '+condition).then(function(recordset) {
		    	console.log(recordset);
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'searchByDistance': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select dbo.udf_Haversine(mm.merchantLat,mm.merchantLong,22.5726,88.3639) as distance from tMerchantMaster mm').then(function(recordset) {
		    	console.log(recordset);
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'customerProfile': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select * from MachinaCRM.dbo.tMemberMaster where memberWechatId=\'WE0002\'').then(function(recordset) {
		    	console.log(recordset);
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'customerTag': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			console.log(err);
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select tm.tagDesc from tTagMaster tm,tMemberTags mt,tMemberMaster mm where tm.tagId=mt.tagId and mt.memberId=mm.memberId and mm.memberWechatId=\'w1\';').then(function(recordset) {
		    	console.log(recordset);
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	//, for multiple functions
	,*/
	'customerProfileTest': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var queryString = 'select * from MachinaCRM.dbo.tMemberMaster where memberWechatId=?';
		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			request.input('input_param',sql.VarChar(50),condition);

		   		request.query('select * from MachinaCRM.dbo.tMemberMaster where memberWechatId= @input_param').then(function(recordset) {
		    	//console.log('select * from MachinaCRM.dbo.tMemberMaster where memberWechatId= @input_param')
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}
	,
	'fetchTagTest': function(req,res,condition,selection,table,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')

		var connection1 = new sql.Connection(config, function(err) {

			var request = new sql.Request(connection1); // or: var request = connection1.request();
			request.input('input_param',sql.VarChar(50),condition);
		
		   		request.query('select tm.tagDesc from tTagMaster tm,tMemberTags mt,tMemberMaster mm where tm.tagId=mt.tagId and mt.memberId=mm.memberId and mm.memberWechatId= @input_param').then(function(recordset) {
		    	
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'addTagTest': function(req,res,wechatid,tag,csrid,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')

		var connection1 = new sql.Connection(config, function(err) {

			var request = new sql.Request(connection1); // or: var request = connection1.request();
			request.input('in_wechatid',sql.VarChar(50),wechatid);
			request.input('in_tag',sql.VarChar(50),tag);
			request.input('in_csrid',sql.VarChar(50),csrid);
		   		request.query('insert into tMemberTags(memberId,tagId,insertedByUserId,modifiedByUserId) select distinct mt.memberId,tm.tagId,@in_csrid,@in_csrid from tMemberMaster mm,tMemberTags mt,tTagMaster tm where mm.memberWechatId = @in_wechatid  and mt.memberId=mm.memberId and tm.tagDesc=@in_tag').then(function(recordset) {
		    	//console.log(recordset);
        		//data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'fetchalltagTest': function(req,res,tag,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')

		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   		request.query('select tagDesc from tTagmaster ').then(function(recordset) {
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'searchByPartialNameTest': function(req,res,tag,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')

		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();
		   		//request.query('select merchantId,merchantNameEng,merchantPhone from tMerchantMaster where merchantNameEng like \'%'+tag+'%\'').then(function(recordset) {
		   		request.query('select mm.merchantNameEng,mm.merchantPhone from tMerchantmaster mm,tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tTagmaster tm where mm.merchantId=mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=tm.tagId and tm.tagDesc like \'%'+tag+'%\'').then(function(recordset) {
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'searchByMerchantTest': function(req,res,wechatid,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();

			request.input('in_wechatid',sql.VarChar(50),wechatid);

		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select a.merchantId,a.merchantNameEng,count(a.tagId) count from( select mm.merchantId,mm.merchantNameEng,mgmtr.tagId from tMerchantMaster mm,tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMemberMaster mem where mm.merchantId=mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mem.memberId=mt.memberId and mem.memberWechatId=@in_wechatid) a group by a.merchantId,a.merchantNameEng order by count desc').then(function(recordset) {
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'searchByDistanceTest': function(req,res,lat,lon,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			request.input('in_lat',sql.Float,lat);
			request.input('in_lon',sql.Float,lon);
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select dbo.udf_Haversine(mm.merchantLat,mm.merchantLong,@in_lat,@in_lon) as distance from tMerchantMaster mm order by distance desc').then(function(recordset) {
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
	,
	'fetchOfferHistoryTest': function(req,res,id,data,callback)          
	{
		var sql = require('mssql');
		var config = require('config/db_connection')
		var connection1 = new sql.Connection(config, function(err) {
			var request = new sql.Request(connection1); // or: var request = connection1.request();
			request.input('in_id',sql.VarChar(50),id);
			
		   	//	request.query('select top 10 mm.merchantId from tMerchantMaster mm, tMerchantGroupRelation mgr,tMerchantGroupMemberTagRelation mgmtr,tMemberTags mt,tMembermaster mem where mm.merchantId = mgr.merchantId and mgr.merchantGroupId=mgmtr.merchantGroupId and mgmtr.tagId=mt.tagId and mt.memberId=mem.memberId and mem.memberWechatId=\'w1\'').then(function(recordset) {
		   		request.query('select top 5 omc.OfferId,ofm.OfferDesc,ofm.merchantId,mem.merchantNameEng from tMemberMaster mm,tOfferforMembers_CRM omc,tOfferByMerchants ofm,tMerchantmaster mem where mm.memberId=omc.memberId  and omc.OfferId=ofm.OfferId and mem.merchantId=ofm.merchantId and mm.memberWechatId=@in_id').then(function(recordset) {
        		data.details = recordset;
        		callback();
        		connection1.close();
		    }).catch(function(err) {
		    	//res.send({data : err});
		    	connection1.close();
		        // ... query error checks 
		    });
			
		});
	}//, for multiple functions
};