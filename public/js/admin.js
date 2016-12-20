angular.module('adminController', ['applicationService.services'])
.controller('admin', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API)
{
	$scope.user_type 			= localStorage.getItem('user_type');
	$scope.user_name 			= localStorage.getItem('csr_name');
	$scope.edit_user_Details 	= {};
	$scope.add_user 		 	= {};
	$rootScope.authenticateUser();
	$scope.show_loader 			= true;
	$scope.add_user.token  		= localStorage.getItem('token');
	$scope.add_user.user_role   = "CSR";
	$scope.User_role = [{
							"name" : "ADMIN",
							"value" : "Admin"
						},
						{
							"name" : "CSR",
							"value" : "CSR"
						}];
	$scope.user_status = [{
							"name" : "Active",
							"value" : "Y"
						},
						{
							"name" : "IN-ACTIVE",
							"value" : "N"
						}];

	$scope.details = { "token" 		: localStorage.getItem('token')};
	API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
		$scope.show_loader = false;
		$scope.user_list = response.data.response_data.details;
	}, function errorCallback(response) {
	});
	$scope.EditUserData = function(data)
	{
		$scope.edit_user_Details = data;
		$scope.edit_user_Details.token = localStorage.getItem('token');
	}
	$scope.AddNewUser = function()
	{
		$scope.error = '';
	}
	$scope.addNewUser = function()
	{
		$scope.error = '';
		if(typeof $scope.add_user.add_user_name =='undefined' || $scope.add_user.add_user_name =='' || $scope.add_user.add_user_name == null)
		{
			$scope.error = "Please enter the username.";
			return false;
		}
		if(typeof $scope.add_user.password =='undefined' || $scope.add_user.password =='' || $scope.add_user.password == null)
		{
			$scope.error = "Please enter user password.";
			return false;
		}
		if(typeof $scope.add_user.email_id =='undefined' || $scope.add_user.email_id =='' || $scope.add_user.email_id == null)
		{
			$scope.error = "Please enter user emailId.";
			return false;
		}
		if(typeof $scope.add_user.user_role =='undefined' || $scope.add_user.user_role =='' || $scope.add_user.user_role == null)
		{
			$scope.error = "Please select the user role.";
			return false;
		}
		$scope.show_add_user_loader = true;
		API.postDetails($scope.add_user,"adminSection/addNewUser").then(function successCallback(response) {
			$scope.show_add_user_loader = false;
			if(response.status == 200)
			{
				API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
					$scope.show_loader = false;
					$scope.user_list = response.data.response_data.details;
				}, function errorCallback(response) {
				});
				document.getElementById("close_add_user").click();
				alert("added successfully");

			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		}, function errorCallback(response) {
		});
	}

	$scope.updateUserDetail = function()
	{
		$scope.error = '';

		/*
		if(typeof $scope.edit_user_Details.userName =='undefined' || $scope.edit_user_Details.userName =='' || $scope.edit_user_Details.userNameedit_user_Details == null)
		{
			$scope.error = "Please enter the username.";
			return false;
		}
		*/
		if(typeof $scope.edit_user_Details.userPwd =='undefined' || $scope.edit_user_Details.userPwd =='' || $scope.edit_user_Details.userPwd == null)
		{
			$scope.error = "Please enter user password.";
			return false;
		}
		if(typeof $scope.edit_user_Details.userEMailId =='undefined' || $scope.edit_user_Details.userEMailId =='' || $scope.edit_user_Details.userEMailId == null)
		{
			$scope.error = "Please enter user emailId.";
			return false;
		}
		if(typeof $scope.edit_user_Details.userRole =='undefined' || $scope.edit_user_Details.userRole =='' || $scope.edit_user_Details.userRole == null)
		{
			$scope.error = "Please select the user role.";
			return false;
		}
		if(typeof $scope.edit_user_Details.UserActiveStatus =='undefined' || $scope.edit_user_Details.UserActiveStatus =='' || $scope.edit_user_Details.UserActiveStatus == null)
		{
			$scope.error = "Please select user active status.";
			return false;
		}
		$scope.show_edit_user_loader = true;
		API.postDetails($scope.edit_user_Details,"adminSection/updateUserDetails").then(function successCallback(response) {
			$scope.show_edit_user_loader = false;
			if(response.status == 200)
			{
				API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
					$scope.user_list = response.data.response_data.details;
				}, function errorCallback(response) {
				});
				document.getElementById("close_edit_model").click();
				alert("user details updated successfully");
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		}, function errorCallback(response) {
		});
	}
})