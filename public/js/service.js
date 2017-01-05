angular.module('applicationService.services', [])
    .factory('API', function ($http) 
    {
	  	//var base = "http://localhost:3500/";
        var base = "http://35.161.211.221:3500/";
        return  {
    				getDetails : function (url,params) {
    					return $http.get(base+url,
                        {

                            method : 'GET',
                            crossDomain: true,
                            headers:{'Content-Type': 'application/json'},
                            params: params
                        });
    				},
                         
                    postDetails : function (form,url) {
        				return $http.post(base+url,
                            JSON.stringify(form),
                            {

                                method : 'POST',
                                crossDomain: true,
                                json: true, 
                                headers:{'Content-Type': 'application/x-www-form-urlencoded'}


                        });
        			 
                    },
                
                }
    })    



    