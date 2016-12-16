angular.module('offerController', ['applicationService.services'])
.controller('offer_display_view', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	

	var current_date 	= new Date();
	$scope.start_date 	= 1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;
	API.getDetails("view_offer_merchant/getViewList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		
		if(response.status == 200)
		{
			$scope.card_type 				= response.data.response_data.cardtype;
			$scope.location_name			= response.data.response_data.offerloc;
			$scope.merchat_details 			= response.data.response_data.merchant_details;
			$scope.category 				= response.data.response_data.category;
			$scope.sub_category 			= response.data.response_data.subcategory;

			$scope.card_type_selected		= "";
			$scope.category_selected 		= '';
			$scope.sub_category_selected 	= '';
			$scope.location_selected 		= '';
			$scope.merchant_selected 		= '';
			$scope.details = {
				card_type 		: "",
				token 			: "",
				category 		: "",
				subcategory 	: "",
				merchant_details: "",
				location 		: "",
				token 			: localStorage.getItem('token'),
				date_range 		: {"from":$scope.start_date ,"to":$scope.end_date}
			};
			API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {

				console.log(response);
				$scope.details_response = response.data.response_data.details;
				$scope.show_loader = false;
			});
		}
		else
		{
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

	$scope.getOfferDisplayView = function()
	{
		$scope.details = {
			card_type 		: $scope.card_type_selected,
			token 			: localStorage.getItem('token'),
			category 		: $scope.category_selected,
			subcategory 	: $scope.sub_category_selected,
			merchant_details: $scope.merchant_selected,
			location 		: $scope.location_selected,
			date_range 		: {"from":$scope.start_date ,"to":$scope.end_date}
		};
		$scope.show_loader = true;
		API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {
			$scope.show_loader = false;
			$scope.details_response = response.data.response_data.details;
		});
	}
	$scope.sortBy = 'merchantName'
	$scope.sort = function(val)
	{
		console.log($scope.sortBy);
		if($scope.sortBy == val)
		{
			
			$scope.sortBy = '-'+val;
		}
		else
		{
			$scope.sortBy = val;
		}
	}

})
.controller('merchant_display_view', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	var current_date 	= new Date();
	$scope.start_date 	= 1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;
	API.getDetails("view_offer_merchant/getViewList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		$scope.show_loader = false;
		if(response.status == 200)
		{
			$scope.card_type 				= response.data.response_data.cardtype;
			$scope.location_name			= response.data.response_data.offerloc;
			$scope.merchat_details 			= response.data.response_data.merchant_details;
			$scope.category 				= response.data.response_data.category;
			$scope.sub_category 			= response.data.response_data.subcategory;

			$scope.card_type_selected		= "";
			$scope.category_selected 		= '';
			$scope.sub_category_selected 	= '';
			$scope.location_selected 		= '';
			$scope.merchant_selected 		= '';
		}
		else
		{
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

})
