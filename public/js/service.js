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
                        headers: { 'Content-Type': 'application/json;charset=utf-8' },
                        params: params
                    });
				},
                postDetails : function (params,url) {
                    return $http.get(base+url,
                    {
                        method : 'GET',  
                        headers: { 'Content-Type': 'application/json;charset=utf-8' },
                        params: params
                    });
                },
/*                
				postDetails : function (form,url) {


					return $http.post(base+url,
                    form,
                    {
                        method : 'POST',  
                         headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    });
				},
*/
                
			}
    })    



    