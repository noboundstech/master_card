angular.module('applicationService.services', [])
    .factory('API', function ($http) 
    {
    //base location of the server     
	 //var base = "http://localhost:3500/";
        var base = "http://ec2-35-161-211-221.us-west-2.compute.amazonaws.com:3500/";
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
                            form,
                            {

                                method : 'POST',
                                crossDomain: true,
                                json: true, 
                                headers:{'Content-Type': 'application/json'}


                        });
        			 
                    },
                
                }
    })    
