angular.module('homeController', ['applicationService.services'])
.controller('home', function($scope)
{
  $scope.details ="i am in home";
})
.controller('login', function($scope,API,$location,$rootScope)
{
	$scope.details ="Login to Your Account";
	$scope.login = {};
	$scope.Loader = false;
	$scope.loginUser = function(){
		// doing validation of the form
		$scope.error = '';
		if(typeof $scope.login.username =='undefined' || $scope.login.username =='' || $scope.login.username ==null)
		{
			$scope.error = "Please enter the username";
			return false;
		}
		
		if(typeof $scope.login.password =='undefined' || $scope.login.password =='' || $scope.login.password ==null)
		{
			$scope.error = "Please enter your password";
			return false;
		}
		$scope.Loader = true;
	// calling api 
		API.postDetails($scope.login,"userLogin/login").then(function successCallback(response) {
			$scope.Loader = false;
			if(response.status == 200)
			{
				$rootScope.user_name = $scope.login.username;
				localStorage.setItem('csr_name', JSON.stringify(response.data.response_data.details[0].userName));
				localStorage.setItem('csr_id', JSON.stringify(response.data.response_data.details[0].userId));
				if(response.data.response_data.details[0].userActiveStatus == 'Y')
				{
					localStorage.setItem('user_type',"csr");
				}
				else
				{
					localStorage.setItem('user_type',"admin");
				}
				localStorage.setItem('last_login',response.data.response_data.details[0].userLastLogin);
				$location.url("dashboard");

			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		    // this callback will be called asynchronously
		    // when the response is available
		}, function errorCallback(response) {
			console.log(response);
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
});