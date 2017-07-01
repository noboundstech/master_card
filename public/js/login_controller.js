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
			if($scope.loginForm.user.$touched)
			{

			}
			else
			{
				$scope.error = "Please enter the username";
			}
			return false;
		}
		
		if(typeof $scope.login.password =='undefined' || $scope.login.password =='' || $scope.login.password ==null)
		{
			if($scope.loginForm.pass.$touched)
			{

			}
			else
			{
				$scope.error = "Please enter your password";
			}
			return false;
		}
		$scope.Loader = true;
		// calling api 
		API.postDetails($scope.login,"userLogin/login").then(function successCallback(response) {
			$scope.Loader = false;
			if(response.status == 200)
			{
				$rootScope.user_name = $scope.login.username;
				localStorage.setItem('csr_name', JSON.stringify(response.data.response_data.user_details[0].userName));
				localStorage.setItem('csr_id', JSON.stringify(response.data.response_data.user_details[0].userId));
				localStorage.setItem('token', response.data.response_data.token);
				if(response.data.response_data.user_details[0].userRole == 'Admin')
				{
					localStorage.setItem('user_role',"admin");
				}
				else
				{
					localStorage.setItem('user_role',"csr");
				}
				localStorage.setItem('last_login',response.data.response_data.user_details[0].userLastLogin);
				$location.url("dashboard");
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
			
			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		    // this callback will be called asynchronously
		    // when the response is available
		}, function errorCallback(response) {
			console.log(response);
			$scope.Loader = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
})
.controller('forget_password', function($scope,API,$location,$rootScope)
{
	$scope.login = {};
	$scope.Loader = false;
	$scope.forgetPassword = function()
	{
		$scope.error = '';
		if(typeof $scope.email =='undefined' || $scope.email =='' || $scope.email ==null)
		{
			if($scope.forgot_password.email.$touched)
			{

			}
			else
			{
				$scope.error = "Please enter your Email Id.";
			}
			return false;
		}
		$scope.Loader = true;
		API.postDetails({email : $scope.email},"userLogin/forget_password").then(function successCallback(response) {
			$scope.Loader = false;
			if(response.status == 200)
			{

				$scope.success = response.data.response_data.message;
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}

			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		}, function errorCallback(response) {
			console.log(response);
			$scope.Loader = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		
	}
})