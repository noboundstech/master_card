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
               
            //    var type2 = utils.getTableColumnType(sql,fieldlist[i].type);
            //       request.input(fieldlist[i].varname,type2,fieldlist[i].value);
            //       vallist+="@"+fieldlist[i].varname;
                 flist+=fieldlist[i].name;
               if (fieldlist[i].varname != "SYSDATETIME()")
                 {
                   var type2 = utils.getTableColumnType(sql,fieldlist[i].type);   
 
                   request.input(fieldlist[i].varname,type2,fieldlist[i].value);   
                  vallist+="@"+fieldlist[i].varname;
                 } 
                else 
                 {   

                    vallist+=fieldlist[i].varname;
                 }  

              
                if(i< fieldlist.length-1)
                {
                    flist+= ",";
                    vallist+= ",";
                }
            }
   
            var query = 'insert into '+table+' '+flist+') values'+vallist +') '+where;
               request.query(query).then(function(err,recordset) {
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
	'MultiInsertToDb': function(req,res,vallist,fieldlist,table,data,callback)        
    {
        var sql = require('mssql');
        var config = require('config/db_connection')
        var utils = require('utility/utils');
        var connection1 = new sql.Connection(config, function(err) {
            //console.log(err);
            var request = new sql.Request(connection1); // or: var request = connection1.request();
                    
            var query = 'insert into '+table+' '+fieldlist+' values '+vallist ;
               request.query(query).then(function(err,recordset) {
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
    }
};