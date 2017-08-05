angular.module('offerController', ['applicationService.services'])
.controller('offer_display_view', function($scope,Excel,MyService,$timeout,$location,$localStorage,
											$rootScope,API,APPLICATION_CONSTANT,$window)
{
	$scope.page_title = APPLICATION_CONSTANT.offer_display_view;
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	$scope.start_date 	= MyService.getStartDate();
	$scope.startDateToShow = $scope.start_date;
	$scope.end_date 	= MyService.getEndDate();
	$scope.show_loader = true;




    $scope.exportToExcel = function(tableId)
    {
    	$scope.header 	= ["Merchant","Offer","Offer Id","Category","Sub Category","Benefit","Offer Location","Post Code"];

    	$scope.excelData= [];
    	if(typeof $scope.details_response != 'undefined')
    	{
	    	for(var i=0;i<$scope.details_response.length;i++)
	    	{
	    		var rowData = [];
	    		rowData.push($scope.details_response[i].merchantName);
	    		rowData.push($scope.details_response[i].Offer_rule_en);
	    		rowData.push($scope.details_response[i].OfferId);
	    		rowData.push($scope.details_response[i].CategoryDesc);
	    		rowData.push($scope.details_response[i].subCategoryDesc);
	    		rowData.push($scope.details_response[i].benefit_name_en);
	    		rowData.push($scope.details_response[i].offer_address_en);
	    		rowData.push($scope.details_response[i].postal_code);
	    		$scope.excelData.push(rowData);

	    	}
	    	var data = {
	    		"excelHeader" : $scope.header,
	    		"excelData"   : $scope.excelData,
	    		"filename"    : "OfferDisplayView" 
	    	}

	    	
	    	API.postDetails(data,"details/convertDataToExcel").then(function successCallback(data) {
				$window.open(APPLICATION_CONSTANT.baseUrl+'download/OfferDisplayView.xlsx','_blank');

			});
			
		}
		else
		{	
			alert("No data available please try again or add more filter.")
		}
    }



    // function to generate pdf
    $scope.generatePDF = function() {
    	$scope.header 	= ["Merchant","Offer","Offer Id","Category","Sub Category","Benefit","Offer Location","Post Code"];

    	$scope.pdfData= [];
    	if(typeof $scope.details_response != 'undefined')
    	{
    		$scope.show_loader_filter = true;
	    	for(var i=0;i<$scope.details_response.length;i++)
	    	{
	    		var rowData = [];
	    		rowData.push($scope.details_response[i].merchantName);
	    		rowData.push($scope.details_response[i].Offer_rule_en);
	    		rowData.push($scope.details_response[i].OfferId);
	    		rowData.push($scope.details_response[i].CategoryDesc);
	    		rowData.push($scope.details_response[i].subCategoryDesc);
	    		rowData.push($scope.details_response[i].benefit_name_en);
	    		rowData.push($scope.details_response[i].offer_address_en);
	    		rowData.push($scope.details_response[i].postal_code);
	    		$scope.pdfData.push(rowData);

	    	}
	    	var data = {
	    		"excelHeader" : $scope.header,
	    		"pdfData"     : $scope.pdfData,
	    		"filename"    : "OfferDisplayViewPdf" 
	    	}

	    	
	    	API.postDetails(data,"details/convertDataToPDF").then(function successCallback(data) {
				$scope.show_loader_filter = false;
				$window.open(APPLICATION_CONSTANT.baseUrl+'download/OfferDisplayViewPdf.pdf','_blank');

			});
			
		}
		else
		{	
			alert("No data available please try again or add more filter.")
		} 
	}

	// function to select all

	$scope.selectAllFilter = function(type)
	{
		if(type == 'card_type')
		{
			$scope.card_type_selected = $scope.card_type;
		}
		if(type == 'category')
		{
			$scope.category_selected = $scope.category;
		}
		if(type == 'sub_category')
		{
			$scope.sub_category_selected = $scope.sub_category;
		}
		if(type == 'merchant')
		{
			$scope.merchant_selected = $scope.merchat_details;
		}
	}

	
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
				date_range 		: {"from":$scope.startDateToShow ,"to":$scope.end_date}
			};

			API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {
				$scope.details_response = response.data.response_data.details;
				$scope.show_loader = false;
			});
		}
		else
		{
			
			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		}
	}, function errorCallback(response) {
			console.log(response);
			$scope.show_loader = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
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
			date_range 		: {"from":$scope.startDateToShow ,"to":$scope.end_date}
		};
		if(MyService.compareTwoDate($scope.start_date,$scope.end_date)== 'error')
		{
			$scope.error = "Your end date must be greater that start date";
			return false;
		}
		$scope.show_loader_details = true;
		API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {
			$scope.show_loader_details = false;
			$scope.details_response = response.data.response_data.details;
			document.getElementById("close_filter").click();

			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		}, function errorCallback(response) {
			console.log(response);
			$scope.show_loader_details = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	$scope.sortBy = 'merchantName';
	$scope.sort = function(val)
	{
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
.controller('merchant_display_view', function($scope,Excel,$timeout,$location,$localStorage,
												$rootScope,API,APPLICATION_CONSTANT,MyService,$window)
{
	$scope.page_title = APPLICATION_CONSTANT.merchant_display_view;
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	$scope.start_date 	= MyService.getStartDate();
	$scope.end_date 	= MyService.getEndDate();
	$scope.show_loader = true;





    $scope.exportToExcel = function(tableId)
    {
    	$scope.header 	= ["Merchant Id","Merchant","Address","Merchant Location","Category","Sub Category","Offer Location"];

    	$scope.excelData= [];
    	if(typeof $scope.details_response != 'undefined')
    	{
	    	for(var i=0;i<$scope.details_response.length;i++)
	    	{
	    		var rowData = [];
	    		rowData.push($scope.details_response[i].MerchantId);
	    		rowData.push($scope.details_response[i].merchantName);
	    		rowData.push($scope.details_response[i].LocationName +" "+$scope.details_response[i].LocationAddress1);
	    		rowData.push($scope.details_response[i].City);
	    		rowData.push($scope.details_response[i].CategoryDesc);
	    		rowData.push($scope.details_response[i].subCategoryDesc);
	    		rowData.push($scope.details_response[i].offer_address_en);
	    		$scope.excelData.push(rowData);

	    	}
	    	var data = {
	    		"excelHeader" : $scope.header,
	    		"excelData"   : $scope.excelData,
	    		"filename"    : "MerchantDisplayView" 
	    	}

	    	
	    	API.postDetails(data,"details/convertDataToExcel").then(function successCallback(data) {
				$window.open(APPLICATION_CONSTANT.baseUrl+'download/MerchantDisplayView.xlsx','_blank');

			});
			
		}
		else
		{	
			alert("No data available please try again or add more filter.")
		}
    }






 $scope.generatePDF = function() {
    	$scope.header 	= ["Merchant Id","Merchant","Address","Merchant Location","Category","Sub Category","Offer Location"];

    	$scope.pdfData= [];
    	if(typeof $scope.details_response != 'undefined')
    	{
    		$scope.show_loader_filter = true;
	    	for(var i=0;i<$scope.details_response.length;i++)
	    	{
	    		var rowData = [];
	    		rowData.push($scope.details_response[i].MerchantId);
	    		rowData.push($scope.details_response[i].merchantName);
	    		rowData.push($scope.details_response[i].LocationName +" "+$scope.details_response[i].LocationAddress1);
	    		rowData.push($scope.details_response[i].City);
	    		rowData.push($scope.details_response[i].CategoryDesc);
	    		rowData.push($scope.details_response[i].subCategoryDesc);
	    		rowData.push($scope.details_response[i].offer_address_en);
	    		$scope.pdfData.push(rowData);

	    	}
	    	var data = {
	    		"excelHeader" : $scope.header,
	    		"pdfData"     : $scope.pdfData,
	    		"filename"    : "merchantDisplayViewPdf" 
	    	}

	    	
	    	API.postDetails(data,"details/convertDataToPDF").then(function successCallback(data) {
				$scope.show_loader_filter = false;
				$window.open(APPLICATION_CONSTANT.baseUrl+'download/merchantDisplayViewPdf.pdf','_blank');

			});
			
		}
		else
		{	
			alert("No data available please try again or add more filter.")
		} 
	}

	// function to select all

	$scope.selectAllFilter = function(type)
	{

		
		if(type == 'card_type')
		{
			$scope.card_type_selected = $scope.card_type;
		}
		if(type == 'category')
		{
			$scope.category_selected = $scope.category;
		}
		if(type == 'sub_category')
		{
			$scope.sub_category_selected = $scope.sub_category;
		}
		if(type == 'merchant')
		{
			$scope.merchant_selected = $scope.merchat_details;
		}
	}

	API.getDetails("view_offer_merchant/getViewList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		if(response.status == 200)
		{
			$scope.card_type 					= response.data.response_data.cardtype;
			$scope.location_name				= response.data.response_data.offerloc;
			$scope.merchant_location_name		= response.data.response_data.merchloc;
			$scope.merchat_details 				= response.data.response_data.merchant_details;
			$scope.category 					= response.data.response_data.category;
			$scope.sub_category 				= response.data.response_data.subcategory;

			$scope.card_type_selected			= '';
			$scope.category_selected 			= '';
			$scope.sub_category_selected 		= '';
			$scope.location_selected 			= '';
			$scope.merchant_location_selected 	= '';
			$scope.merchant_selected 			= '';
			$scope.details = {
				card_type 			: $scope.card_type_selected,
				token 				: "",
				category 			: "",
				subcategory 		: "",
				merchant_details	: "",
				location 			: "",
				token 				: localStorage.getItem('token'),
				merchant_location 	: $scope.merchant_location_selected
			};
			API.postDetails($scope.details,"view_offer_merchant/getMerchantView").then(function successCallback(response) {
				$scope.details_response = response.data.response_data.details;
				$scope.show_loader = false;
			});
		}
		else
		{
			
			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		}
	}, function errorCallback(response) {
			console.log(response);
			$scope.show_loader = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});

	$scope.getMerchantDisplayView = function()
	{
		$scope.details = {
			card_type 			: $scope.card_type_selected,
			token 				: localStorage.getItem('token'),
			category 			: $scope.category_selected,
			subcategory 		: $scope.sub_category_selected,
			merchant_details	: $scope.merchant_selected,
			location 			: $scope.location_selected,
			merchant_location 	: $scope.merchant_location_selected
		};
		$scope.show_loader_filter = true;
		API.postDetails($scope.details,"view_offer_merchant/getMerchantView").then(function successCallback(response) {
			$scope.show_loader_filter = false;
			$scope.details_response = response.data.response_data.details;
			document.getElementById("close_filter").click();
			
			if(response.status == 502)
			{
				console.log(response);
				alert("internal server error.");
			}
		}, function errorCallback(response) {
			console.log(response);
			$scope.show_loader_filter = false;
			alert("internal server error");
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	$scope.sortBy = 'merchantName'
	$scope.sort = function(val)
	{
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
