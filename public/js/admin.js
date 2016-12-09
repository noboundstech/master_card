angular.module('adminController', ['applicationService.services'])
.controller('admin', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$scope.edit_user_Details = {};
	$rootScope.authenticateUser();
	$scope.show_loader = true;
	$scope.details = { "token" 		: localStorage.getItem('token')}
	API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
		$scope.show_loader = false;
		$scope.user_list = response.data.response_data.details;
	}, function errorCallback(response) {
		
	});

	$scope.EditUserData = function(data)
	{
		$scope.edit_user_Details = data;
	//	document.getElementById("").value = ;
	}
})