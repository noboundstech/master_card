angular.module('userController', ['applicationService.services'])
.controller('user', function($scope,$rootScope,$http,$routeParams,$location,$localStorage,$interval,API)
{
	$scope.show_id   = 0;
	$scope.show_cust = false;;
	$scope.offer_history =[];
	$scope.state =[];
	$scope.states = [];
	$scope.user_details = [];
	$scope.customer_tag = [];
	$scope.address = {};
	$scope.chat_details =[];
	$scope.search_type  = "distance";
	$scope.search_by_merchant_tag = '';
	var socket = io.connect();
	// the default center if we can give
	$scope.points = '';


	$scope.mapOptions = {};
    $scope.mapOptions.center = "";
    $scope.mapOptions.zoom = 15;
    $scope.mapOptions.mapType = 'a';
     $scope.mapOptions.options = {
        scrollwheel: false,
        disableZooming: true
    }
    /*<pushpin> directive options*/
    $scope.pushpin = {};
    $scope.pushpin.options = {
        draggable: false
    }

	$scope.CallRestService = function(request) {
	    $.ajax({
	        url: request,
	        dataType: "jsonp",
	        jsonp: "jsonp",
	        success: function (r) {
	        	if(r.statusCode == 200 )
	        	{
		        	$scope.mapOptions.center = {"latitude": r.resourceSets[0].resources[0].point.coordinates[0], "longitude":  r.resourceSets[0].resources[0].point.coordinates[1]};
		            $scope.pushpin.latitude =  r.resourceSets[0].resources[0].point.coordinates[0];
		            $scope.pushpin.longitude =  r.resourceSets[0].resources[0].point.coordinates[1];
		            $scope.getDetailsByLocation();
		        }
		        else
		        {
		        	alert(e.authenticationResultCode);
		        }
	        },
	        error: function (e) {
	            alert(e.statusText);
	        }
	    });
	}

	/*
	var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/US/WA/Redmond/1%20Microsoft%20Way?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5";

	CallRestService(geocodeRequest);
	*/

	if(localStorage.getItem('user_details') == 'undefined' || localStorage.getItem('user_details') == null)
	{
		$scope.user_details =[];
	}
	else
	{
		$scope.user_details = JSON.parse(localStorage.getItem('user_details'));
	}

	// function to get merchant by location
	$scope.getMerchantDetailsByLocation = function(lotlng,type)
	{
		API.getDetails("userfetch/searchbydistance",$scope.location_details).then(function successCallback(response) {
			$scope.merchant_by_location_details = '';
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.merchant_by_location_details = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSearchByDistanceLoader')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			$scope.show_user_location ='current';
		}, function errorCallback(response) {
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSearchByDistanceLoader')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get tag made to the customer
	$scope.getTagDetailByCustomer = function(detail,type)
	{
		API.getDetails("userfetch/fetchtag",detail).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					if(response.data.message.details.length>0)
					{
						$scope.customer_tag = response.data.message.details;
					}
					else
					{
						$scope.customer_tag = [];
					}
				}
			}
			else
			{
				// show error message
			}
			if(type == 'showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
			if(type == 'show_remove_tag_loader')
			{
				$scope.show_remove_tag_loader = false;
			}
			if(type == 'show_add_tag_loader')
			{
				$scope.show_add_tag_loader = false;
			}
		}, function errorCallback(response) {
			if(type == 'showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
			if(type == 'show_remove_tag_loader')
			{
				$scope.show_remove_tag_loader = false;
			}
			if(type == 'show_add_tag_loader')
			{
				$scope.show_add_tag_loader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get all merchant details which are tag to the customer
	$scope.getMerchantDetailsByCustomer = function(details,type)
	{
		API.getDetails("userfetch/searchbymerchant",details).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.response_data.details !='undefined' && response.data.response_data.details.length>0)
				{
					$scope.merchant_details = response.data.response_data.details;
				}
			}
			else
			{
				// show error message
			}
			if(type=='showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
		}, function errorCallback(response) {
			if(type=='showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get all the offer history made to the customer
	$scope.getCustomerOfferHistory = function(id,customer_name,location,index)
	{
	//	$scope.showCustomerOffer = true;
		$scope.customer_id = id;
		$scope.positions = [];
		$scope.user_details[index].notification = 0;
		$scope.offer_history = '';
		$scope.show_id      = id;
		$scope.show_cust    = true;
		$scope.cust         = customer_name;
		// fetching all the offer offered to the customer
		API.getDetails("userfetch/fetchofferhistory",{id : id}).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.offer_history = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			$scope.showCustomerOffer = false;
		}, function errorCallback(response) {
			$scope.showCustomerOffer = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		
		// if location are provided by we chat than get merchant details by location
		if(typeof location != 'undefined' && location !='')
		{
			if(typeof location.latitude !='undefined' && location.latitude !='' && location.latitude !=null )
			{
				$scope.show_user_location = 'current';
				$scope.merchant_by_location_details = '';
				$scope.mapOptions.center = {"latitude": location.latitude, "longitude": location.longitude };
				$scope.location_details ={
					lat : location.latitude,
					lon : location.longitude
				};
				$scope.pushpin.latitude = location.latitude;
	            $scope.pushpin.longitude = location.longitude;
				$scope.showSearchByDistanceLoader = true;
				$scope.getMerchantDetailsByLocation($scope.location_details,"showSerachByDistance");
			}
			else
			{
				$scope.show_user_location = 'choosen';
				 $scope.mapOptions.center = '';
			}
		}
		else
		{
			$scope.show_user_location = 'choosen';
			$scope.mapOptions.center = '';
		}
		$scope.send_to_customer =id;
		// adding new user into the socket
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
	}

	// get all customer details when the csr will click on customer list in left side
	$scope.getCustomerDetails = function(id,customer_name,location,index)
	{
		$scope.showCustomerLoader = true;
		$scope.customer_id = id;
		$scope.customer_details ='';
		$scope.merchant_by_location_details = '';
		$scope.merchant_details = '';
		$scope.customer_tag = '';
		// fetching all tag irrespective of the customer
		API.getDetails("userfetch/fetchalltag",{}).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.tags = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			$scope.showCustomerLoader = false;
		}, function errorCallback(response) {
			$scope.showCustomerLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		// fetching all profile details of the customer
		API.getDetails("userfetch/fetchprofile",{id : id}).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.customer_details = response.data.message.details[0];
				}
			}
			else
			{
				// show error message
			}
			$scope.showCustomerLoader = false;
		}, function errorCallback(response) {
			$scope.showCustomerLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		// calling function to fetch all tag which are taged to this customer
		$scope.getTagDetailByCustomer({id : id},"showCustomerLoader");
		// fetching all merchant details which are tag to the given customer
		$scope.getMerchantDetailsByCustomer({id : id},"showCustomerLoader");
		$scope.getCustomerOfferHistory(id,customer_name,location,index);
		$scope.search_type  = "distance";
	}
	$scope.openReadmoreModel = function(details)
	{
		$scope.user_offer_history_details = details;
	}

	$scope.searchType = function(type)
	{
		$scope.search_type  = type;
	}
	$scope.changeLocation = function(location_type)
	{
		$scope.show_user_location = location_type
	}
	$scope.getDetailsByLocation = function()
	{
		$scope.location_details 	= { lat :  $scope.mapOptions.center.latitude, lon :  $scope.mapOptions.center.longitude};
		$scope.pushpin.latitude 	= $scope.mapOptions.center.latitude;
	    $scope.pushpin.longitude 	= $scope.mapOptions.center.longitude;
		$scope.merchant_by_location_details = '';
		$scope.showSearchByDistanceLoader = true;

		// calling function to get all merchant details by the given location
		$scope.getMerchantDetailsByLocation($scope.location_details,"showSearchByDistanceLoader");
	}
	// function to get merchant details by tag type in the search merchant text
	$scope.searchMerchantByTag = function()
	{
		$scope.showSearchMerchantTagLoader = true;
		$scope.search_by_merchant_tag = document.getElementById("search_by_merchant_tag").value;
		API.getDetails("userfetch/searchbypart",{tag : $scope.search_by_merchant_tag}).then(function successCallback(response) {

			$scope.merchant_details = '';
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.merchant_details = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			$scope.showSearchMerchantTagLoader = false;
		}, function errorCallback(response) {
			$scope.showSearchMerchantTagLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	$scope.addChatIntoLocalstorage = function(data)
	{
		localStorage.setItem('char_message', JSON.stringify(data));
	}
	$scope.clearTextMessage = function()
	{
		$scope.csr_message = '';
	}

	// getting all merchant details if csr provide location by typing
	$scope.getLatitudeLongitude = function(type) {
		var address_detail_array = [];
		var address_details ='';
		if(type =='address')
		{
			if(typeof  $scope.address.street != 'undefined')
			{
				address_detail_array.push($scope.address.street);
			}
			if(typeof  $scope.address.province != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.province);
			}
			if(typeof  $scope.address.city != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.city);
			}
			if(typeof  $scope.address.district != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.district);
			}
			if(typeof  $scope.address.country != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.country);
			}
			if(typeof  $scope.address.postcode != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.postcode);
			}
		}
		else
		{
			address_details = "/"+document.getElementById("address_autocomplete").value;
		}
		for(i=0;i<address_detail_array.length;i++)
		{
			address_details+=address_detail_array[i];
		}

		var url = 'http://dev.virtualearth.net/REST/v1/Locations/'+address_details+'/?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5';
		//var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/US/WA/Redmond/1%20Microsoft%20Way?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5";

		$scope.CallRestService(url);
	}
	// Define options
    $scope.autocompleteOptions = {};
    // Listen to change event
    $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
      $scope.getLatitudeLongitude("autocomplete");
    });
    // function called when new tag get added by the csr to the customer
    $scope.addNewTag = function()
    {
    	$scope.add_tag_error ='';
    	if(typeof $scope.add_customer_tag =='undefined')
    	{
    		$scope.add_tag_error ='Please select tag to be added';
    		return false;
    	}
    	if($scope.add_customer_tag.length == 0 )
    	{
    		$scope.add_tag_error ='Please select tag to be added';
    		return false;
    	}
    	$scope.show_add_tag_loader = true;
    	var details = {	"id" 		: $scope.customer_id,
    					"tags" 		: $scope.add_customer_tag,
    					"csr_id" 	: JSON.parse(localStorage.getItem('csr_id')),
    					"member_id" : $scope.customer_details.memberId
    				};
    	API.postDetails(details,"userfetch/addtag").then(function successCallback(response) {
			$scope.show_add_tag_loader = false;

			if(response.status == 200)
			{
				if($scope.customer_tag == '')
				{
					$scope.customer_tag = [];
				}
				for(i=0;i<$scope.add_customer_tag.length;i++)
				{
					$scope.customer_tag.push({"tagDesc" : $scope.add_customer_tag[i].tagDesc});
				}
				$scope.add_customer_tag ='';
				// once the tag got added calling function to refreash the tag details
				$scope.getTagDetailByCustomer({id :  $scope.customer_id},"show_add_tag_loader");
				// getting all merchant details once the new tag got added by the csr to the customer
				$scope.getMerchantDetailsByCustomer({id : $scope.customer_id},"show_add_tag_loader");
			}
			else
			{
				// show error message
			}
		}, function errorCallback(response) {
			$scope.showCustomerOffer = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
    }
    // function to remove the tag details of the customer
    $scope.removeCustomerTag = function(tag,tagId)
    {
    	
    	$scope.show_remove_tag_loader = true;
    	var details = {	"id" 		: $scope.customer_id,
    					"tags" 		: [{ "tagId" : tagId,
    									"tagDesc" : tag
    									}],
    					"csr_id" 	: JSON.parse(localStorage.getItem('csr_id')),
    					"member_id" : $scope.customer_details.memberId
    				};
    	API.postDetails(details,"userfetch/removetag").then(function successCallback(response) {
    		
    		// calling function to update the tag to the customer
    		$scope.getTagDetailByCustomer({id :  $scope.customer_id},"show_remove_tag_loader");
    		// calling function to update the merchant details of the customer
    		$scope.getMerchantDetailsByCustomer({id : $scope.customer_id},"show_remove_tag_loader");
    	//	$scope.show_remove_tag_loader = false;
    	}, function errorCallback(response) {
			$scope.show_remove_tag_loader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
    }


    /* socket related code */

    if(localStorage.getItem('char_message') != 'undefined' && localStorage.getItem('char_message') != null)
	{
		$scope.chat_details = JSON.parse(localStorage.getItem('char_message'));
	}
	$(".messages").scrollTop($(".messages")[0].scrollHeight);
	var stop = $interval(function() {
		console.log("clear all data");
	}, 300000);

	if(localStorage.getItem('csr_name') != 'undefined' && localStorage.getItem('csr_name') != null)
	{
		$scope.csr_id 	= JSON.parse(localStorage.getItem('csr_name'));
		socket.emit('new user',{type : "csr" , id : $scope.csr_id,"csr" : $scope.csr_id},function(data){
			if(!data.status)
			{
				if(data.connect_by =='csr')
				{
					alert(data.message);
					location.reload();
				}
				else
				{
					alert(data.message);
				}
			}
		});
	}
  	$scope.sendChatMessageFromCsr = function (){
  		var checkedValue = '';
  		if($scope.search_type == 'distance')
  		{
  			

			var inputElements = document.getElementsByClassName('distance_offer_checkbox');
			for(var i=0; inputElements[i]; ++i){
			    if(inputElements[i].checked){
		      		if(checkedValue != '' && checkedValue != 'undefined ' && checkedValue != null)
		      		{
		           		checkedValue +=" , "+inputElements[i].value;
		            }
		            else
		            {
		            	checkedValue +=inputElements[i].value;
		            }
		            inputElements[i].checked = false;
			    }
			}
  		}
  		if($scope.search_type == 'merchant')
  		{
			var inputElements = document.getElementsByClassName('merchant_offer_checkbox');
			for(var i=0; inputElements[i]; ++i){
			    if(inputElements[i].checked){
		      		if(checkedValue != '' && checkedValue != 'undefined ' && checkedValue != null)
		      		{
		           		checkedValue +=" , "+inputElements[i].value;
		            }
		            else
		            {
		            	checkedValue +=inputElements[i].value;
		            }
		            inputElements[i].checked = false;
			    }
			}
  		}
  		if(checkedValue!='')
  		{
  			if(typeof $scope.csr_message !='undefined' && $scope.csr_message != null)
  			{
  				$scope.message_sending_detail = $scope.csr_message + "  "+checkedValue;
  			}
  			else
  			{
  				$scope.message_sending_detail = checkedValue;
  			}
  		}
  		else
  		{
  			$scope.message_sending_detail = $scope.csr_message;
  		}
  		if($scope.message_sending_detail != '')
		{
  			socket.emit("send message",{ "csr_id" : $scope.csr_id,"sender_id" : $scope.csr_id,"customer_id" :$scope.cust_id,"message" : $scope.message_sending_detail,"cust_id" : $scope.send_to_customer});
  		}
  		$scope.csr_message ='';
	}
	socket.on("new message",function(data){
		$scope.chat_details.push(data);
		//$scope.$apply();
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
		$scope.addChatIntoLocalstorage($scope.chat_details);
		if($scope.customer_id == data.cust_id)
		{
			$(".messages").scrollTop($(".messages")[0].scrollHeight);
		}
		else
		{
			for(i=0;i<$scope.user_details.length;i++)
			{
				if($scope.user_details[i].id == data.cust_id)
				{
					$scope.user_details[i].notification +=1;
				}
			}
		}
		if(data.sender_id != $scope.csr_id)
		{
			var myAudio = new Audio("sound/Sonic_Ring_freetone.at.ua.mp3");
			myAudio.play()
		}
		$scope.$digest();
	})
	socket.on("new customer added",function(data){
		for(i=0;i<$scope.user_details.length;i++)
		{
			if(data.id == $scope.user_details[i].id)
			{
				$scope.user_details.splice(i, 1);
			}
		}
		$scope.user_details.push(data);
		localStorage.setItem('user_details', JSON.stringify($scope.user_details));
		$scope.$digest();
	})
	socket.on("exit_connection_with_csr",function(data){
		$scope.new_chat_user_list = angular.copy($scope.user_details);
		$scope.user_details = [];
		for(i=0;i<$scope.new_chat_user_list.length;i++)
		{
			if($scope.new_chat_user_list[i].id != data)
			{
				$scope.user_details.push($scope.new_chat_user_list[i]);
			}
			else
			{
				if(data == $scope.new_chat_user_list[i].id)
				{
					$scope.show_cust = false;
				}
			}
		}
		$scope.$apply();
	})
})
.controller('customer', function($scope,$http,$routeParams,$location,$localStorage)
{
	$scope.show_id   = 0;
	$scope.show_cust = false;;
	$scope.offer_history =[];
	$scope.state =[];
	$scope.states = [];
	var socket = io.connect();
	$scope.cust_id 	= $routeParams.userId;
	$scope.cust_id = $scope.cust_id.substr(1);
	$scope.chat_details =[];

	

	$scope.makeNewConnection = function()
	{
		socket.emit('new user',{type : "customer" , "id" : $scope.cust_id,"csr" : $scope.csr_id},function(data){
			if(!data.status)
			{
				alert(data.message)
			}
			else
			{
				$scope.csr_id = data.csr_id;
				localStorage.setItem('customer_csr_name', JSON.stringify(data.csr_id));
			}
		});
	}
	if(localStorage.getItem('customer_csr_name') != 'undefined' && localStorage.getItem('customer_csr_name') != null)
	{
		$scope.csr_id = JSON.parse(localStorage.getItem('customer_csr_name'));
		$scope.makeNewConnection();
	}
	else
	{
		$scope.csr_id   = 'find_new_csr';
		$scope.makeNewConnection();
	}
	socket.on("make_connection_with_csr",function(data){

		localStorage.setItem('customer_csr_name', JSON.stringify(data));
		$scope.csr_id = data;
		$scope.$apply();
	})
	$scope.sendChatMessageByCustomer = function (){
		if($scope.customer_message != '')
		{
  			socket.emit("send message",{ "csr_id" : $scope.csr_id,"sender_id" : $scope.cust_id,"customer_id" :$scope.cust_id,"message" : $scope.customer_message,"cust_id" : $scope.cust_id});
  		}
  		$scope.customer_message ='';
	}
	socket.on("new message",function(data){

		$scope.chat_details.push(data);
		$scope.$apply();
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
		$scope.addChatIntoLocalstorage($scope.chat_details);
	})
	$scope.addChatIntoLocalstorage = function(data)
	{
		localStorage.setItem('chat_message', JSON.stringify(data));
	}
	if(localStorage.getItem('chat_message') != 'undefined' && localStorage.getItem('chat_message') != null)
	{
		$scope.chat_details = JSON.parse(localStorage.getItem('chat_message'));
	}
	$(".messages").scrollTop($(".messages")[0].scrollHeight);
	$scope.clearTextMessage = function()
	{
		$scope.customer_message = '';
	}
	$scope.logoutCustomer = function()
	{
		localStorage.removeItem("customer_csr_name");
	    localStorage.removeItem("chat_message");
	    $location.url("");
	}
})
.controller('dashboard', function($scope,$localStorage)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
})
.controller('customer_profile', function($scope,$localStorage,API)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$scope.show_search_details = true;
	$scope.wechat_id = '';
	//$scope.customer_tag = [{"tagDesc":"Life Style","tagId":2},{"tagDesc":"Dining","tagId":4},{"tagDesc":"Shopping","tagId":5},{"tagDesc":"Peace-of-mind","tagId":6}];
	

	$scope.mapOptions = {};
    $scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
    $scope.mapOptions.zoom = 12;
    $scope.mapOptions.mapType = 'a';
     $scope.mapOptions.options = {
        scrollwheel: false,
        disableZooming: true
    }
    /*<pushpin> directive options*/
    $scope.pushpin = {};
    $scope.pushpin.options = {
        draggable: false
    }
    $scope.pushpin.latitude 	= 39.9042;
	$scope.pushpin.longitude 	= 116.4074;

	var current_date 	= new Date();
	$scope.start_date 	= current_date.getMonth()+1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();

	
	$scope.showCustomerDetail = function()
	{
		$scope.wechat_id = document.getElementById("wechat_id").value;
		$scope.error_message = '';
		if(typeof $scope.wechat_id =='undefined' || $scope.wechat_id =='' || $scope.wechat_id ==null)
		{
			$scope.error_message = "Please enter the WeChat Id.";
			$scope.customer_details = '';
			$scope.customer_tag = [];
			$scope.offer_history = '';
			$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
			$scope.pushpin.latitude 	= 39.9042;
			$scope.pushpin.longitude 	= 116.4074;
			return false;
		}
		else
		{
			$scope.showCustomerLoader = true;
			// fetching all profile details of the customer
			API.postDetails({wechat_id : $scope.wechat_id},"api/getCustomerDetails").then(function successCallback(response) {
				if(response.status == 200)
				{
					
					$scope.customer_details = response.data.response_data.details[0];
					$scope.show_search_details = false;

					// calling api to fetch all tag details
					API.getDetails("userfetch/fetchtag",{id : $scope.wechat_id}).then(function successCallback(response) {
						if(response.status == 200)
						{
							if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
							{
								if(response.data.message.details.length>0)
								{
									$scope.customer_tag = response.data.message.details;
								}
								else
								{
									$scope.customer_tag = [];
								}
							}
						}
						else
						{

							// show error message
						}
						$scope.showCustomerLoader = false;
					}, function errorCallback(response) {
						$scope.showCustomerLoader = false;
					});
					// calling api to get offer history of the customer
					API.getDetails("userfetch/fetchofferhistory",{id : $scope.wechat_id}).then(function successCallback(response) {
						if(response.status == 200)
						{
							if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
							{
								$scope.offer_history = response.data.message.details;
							}
						}
						else
						{
							// show error message
						}
						
					}, function errorCallback(response) {
						$scope.showCustomerOffer = false;
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					});
					var address_details = '';
					if($scope.customer_details.AddressLine1 != '' && $scope.customer_details.AddressLine1 != null)
					{
						address_details = " "+$scope.customer_details.AddressLine1;
					}
					if($scope.customer_details.AddressLine2 != '' && $scope.customer_details.AddressLine2 != null)
					{
						address_details+= " "+$scope.customer_details.AddressLine2;
					}
					if($scope.customer_details.City != '' && $scope.customer_details.City != null)
					{
						address_details+= " "+$scope.customer_details.City;
					}
					if($scope.customer_details.District != '' && $scope.customer_details.District != null)
					{
						address_details+= " "+$scope.customer_details.District;
					}
					if($scope.customer_details.Province != '' && $scope.customer_details.Province != null)
					{
						address_details+= " "+$scope.customer_details.Province;
					}
					if($scope.customer_details.Country != '' && $scope.customer_details.Country != null)
					{
						address_details+= " "+$scope.customer_details.Country;
					}
					if(address_details != '')
					{	
						var url = 'http://dev.virtualearth.net/REST/v1/Locations/'+address_details+'/?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5';
						$.ajax({
					        url: url,
					        dataType: "jsonp",
					        jsonp: "jsonp",
					        success: function (r) {
					        	if(r.statusCode == 200 )
					        	{
					        		if(r.resourceSets[0].resources.length>0)
					        		{
							        	$scope.mapOptions.center = {"latitude": r.resourceSets[0].resources[0].point.coordinates[0], "longitude":  r.resourceSets[0].resources[0].point.coordinates[1]};
							            $scope.pushpin.latitude =  r.resourceSets[0].resources[0].point.coordinates[0];
							            $scope.pushpin.longitude =  r.resourceSets[0].resources[0].point.coordinates[1];
							        }
							        else
							        {
							        	$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
										$scope.pushpin.latitude 	= 39.9042;
										$scope.pushpin.longitude 	= 116.4074;
							        }
						        }
						        else
						        {
									$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
									$scope.pushpin.latitude 	= 39.9042;
									$scope.pushpin.longitude 	= 116.4074;
						        }
					        },
					        error: function (e) {
					            alert(e.statusText);
					        }
					    });
					}

				}
				else
				{
					$scope.error_message = response.data.response_data.message;
					$scope.showCustomerLoader = false;
					$scope.customer_details = '';
					$scope.customer_tag = [];
					$scope.offer_history = '';
					$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
					$scope.pushpin.latitude 	= 39.9042;
					$scope.pushpin.longitude 	= 116.4074;
					// show error message
				}
			}, function errorCallback(response) {
				$scope.showCustomerLoader = false;
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
		}
		
	}

	$scope.getCustomerForm = function()
	{
		$scope.show_search_details = true;
	}

})
.controller('offer_segment', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$scope.checkboxModel = {};
	$scope.total_checked = 3;
	$rootScope.map_type = 'default';
	$scope.checkboxModel.card_type 			= false;
	$scope.checkboxModel.gender 			= false;
	$scope.checkboxModel.location_details 	= false;
	$scope.checkboxModel.age_grouped 		= false;
	$scope.checkboxModel.date_range 		= true;
	$scope.checkboxModel.segment 			= false;
	$scope.checkboxModel.tag_details 		= false;
	$scope.x_axis_selected 					= '';
	$scope.y_axis_selected 					= '';
	$scope.default_segment_filter = [];
	$scope.age_group_filter = [];

	var current_date 	= new Date();
	$scope.start_date 	= 1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;

	API.getDetails("customer_segment/getCustReportList",{}).then(function successCallback(response) {
		$scope.show_loader = false;
		if(response.status == 200)
		{
			$scope.card_type 		= response.data.response_data.cardtype;
			$scope.gender_type 		= [{"name":"Male"},{"name":"Female"}];
			$scope.location_name	= response.data.response_data.custloc;
			$scope.age_group_type 	= response.data.response_data.age_group;
			$scope.segment_type 	= response.data.response_data.custseg;
			$scope.tag_type 		= response.data.response_data.tag;
		//	$scope.getNewChatDetails();
		}
		else
		{
			// show error message
		}
		
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});


	$scope.getNewChatDetails = function()
	{
		$scope.show_loader = true;
		$scope.card_type_selected_details = [];
		$scope.segment_selected_details = [];
		$scope.age_grouped_selected_details = [];
		$scope.location_filter_selected_details = [];
		if($scope.x_axis_selected == 'card_type' || $scope.y_axis_selected == 'card_type')
		{
			for(i=0;i<$scope.card_type_filter_details.length;i++)
			{
				$scope.card_type_selected_details.push({"name" : $scope.card_type_filter_details[i].card_type});
			}
		}
		if($scope.x_axis_selected == 'age_grouped' || $scope.y_axis_selected == 'age_grouped')
		{
			for(i=0;i<$scope.age_group_filter.length;i++)
			{
				$scope.age_grouped_selected_details.push({"name" : $scope.age_group_filter[i].value});
			}
		}
		if($scope.x_axis_selected == 'location' || $scope.y_axis_selected == 'location')
		{
			for(i=0;i<$scope.location_filter.length;i++)
			{
				$scope.location_filter_selected_details.push({"name" : $scope.location_filter[i].cust_location});
			}
		}
		if($scope.x_axis_selected == 'segment' || $scope.y_axis_selected == 'segment')
		{
			for(i=0;i<$scope.segment_filter.length;i++)
			{
				$scope.segment_selected_details.push({"name" : $scope.segment_filter[i].cust_segment});
			}
		}
		$scope.request_details = {
									"card_type"		: $scope.card_type_selected_details,
									"tags"			: $scope.tag_details_filter,
									"locations"		: $scope.location_filter_selected_details,
									"age_grouped"	: $scope.age_grouped_selected_details,
									"segment"		: $scope.segment_selected_details,
									"gender"		: $scope.gender_type_filter,
									"date_range"	:
														{ 
															"from" 	: $scope.start_date,
															"to"	: $scope.end_date
														},
									"x_axis" 		: $scope.x_axis_selected,
									"y_axis" 		: $scope.y_axis_selected 
								} 

		API.postDetails($scope.request_details,"customer_segment/getCustSegReportData").then(function successCallback(response) {
			$scope.show_loader = false;
			
			if(response.status == 200)
			{
				var  category		= response.data.response_data.Graph_data[0].x_axis_name;
				var chart_details 	= response.data.response_data.Graph_data[0].y_array_header;

				console.log(chart_details);
				Highcharts.chart('container', {

		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: ""
		        },

		        xAxis: {
		            categories : category
		        },

		        yAxis: {
		            allowDecimals: false,
		            min: 0,
		            title: {
		                text: $scope.y_axis_selected
		            }
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.x + '</b><br/>' +
		                    this.series.name + ': ' + this.y + '<br/>' +
		                    'Total: ' + this.point.stackTotal;
		            }
		        },

		        plotOptions: {
		            column: {
		                stacking: 'normal'
		            }
		        },

		        series: chart_details
		    });
		}
		else
		{
			// show error message
		}
		
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

		 
	}
	
	$scope.changeChecboxStatus = function(type,axis)
	{
		if(axis == 'x_axis')
		{
			// checking for card type
			if(type =='card_type')
			{
				if($scope.x_axis_selected != 'card_type')
				{

					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}

					$scope.x_axis_selected 			= 'card_type';
					$scope.checkboxModel.card_type 	= true;

					document.getElementById("y_axis_card_type").disabled = true;
					document.getElementById("y_axis_gender").disabled 	= false;
					document.getElementById("y_axis_location").disabled = false;
					document.getElementById("y_axis_age_group").disabled = false;
					document.getElementById("y_axis_tags").disabled = false;
					document.getElementById("y_axis_segment").disabled = false;
				}
			}
			// checking for gender
			if(type =='gender')
			{
				if($scope.x_axis_selected != 'gender')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}



					$scope.x_axis_selected 			= 'gender';
					$scope.checkboxModel.gender 	= true;

					document.getElementById("y_axis_gender").disabled = true;
					document.getElementById("y_axis_card_type").disabled = false;
					document.getElementById("y_axis_location").disabled = false;
					document.getElementById("y_axis_age_group").disabled = false;
					document.getElementById("y_axis_tags").disabled = false;
					document.getElementById("y_axis_segment").disabled = false;
				}
			}
			// checking for tags
			if(type =='tags')
			{
				if($scope.x_axis_selected != 'tags')
				{
					console.log($scope.x_axis_selected );
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.x_axis_selected 			= 'tags';
					$scope.checkboxModel.tag_details = true;
					document.getElementById("y_axis_tags").disabled = true;
					document.getElementById("y_axis_card_type").disabled = false;
					document.getElementById("y_axis_location").disabled = false;
					document.getElementById("y_axis_age_group").disabled = false;
					document.getElementById("y_axis_gender").disabled = false;
					document.getElementById("y_axis_segment").disabled = false;
				}
			}
			// checking for location
			if(type =='location')
			{
				if($scope.x_axis_selected != 'location')
				{
					console.log($scope.x_axis_selected );
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.x_axis_selected 					= 'location';
					$scope.checkboxModel.location_details 	= true;
					document.getElementById("y_axis_tags").disabled = false;
					document.getElementById("y_axis_card_type").disabled = false;
					document.getElementById("y_axis_location").disabled = true;
					document.getElementById("y_axis_age_group").disabled = false;
					document.getElementById("y_axis_gender").disabled = false;
					document.getElementById("y_axis_segment").disabled = false;
				}
			}
			// checking for age group
			if(type =='age_group')
			{
				if($scope.x_axis_selected != 'age_grouped')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.x_axis_selected 				= 'age_grouped';
					$scope.checkboxModel.age_grouped 	= true;
					document.getElementById("y_axis_tags").disabled = false;
					document.getElementById("y_axis_card_type").disabled = false;
					document.getElementById("y_axis_location").disabled = false;
					document.getElementById("y_axis_age_group").disabled = true;
					document.getElementById("y_axis_gender").disabled = false;
					document.getElementById("y_axis_segment").disabled = false;
				}
			}
			// checking for segment
			if(type =='segment')
			{
				console.log($scope.x_axis_selected);
				if($scope.x_axis_selected != 'segment')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					$scope.x_axis_selected 				= 'segment';
					$scope.checkboxModel.segment 	= true;
					document.getElementById("y_axis_tags").disabled = false;
					document.getElementById("y_axis_card_type").disabled = false;
					document.getElementById("y_axis_location").disabled = false;
					document.getElementById("y_axis_age_group").disabled = false;
					document.getElementById("y_axis_gender").disabled = false;
					document.getElementById("y_axis_segment").disabled = true;
				}
			}
		}
		else
		{
			// checking for card type
			if(type =='card_type')
			{
				if($scope.y_axis_selected != 'card_type')
				{

					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}

					$scope.y_axis_selected 			= 'card_type';
					$scope.checkboxModel.card_type 	= true;
					document.getElementById("x_axis_card_type").disabled = true;
					document.getElementById("x_axis_gender").disabled 	= false;
					document.getElementById("x_axis_location").disabled = false;
					document.getElementById("x_axis_age_group").disabled = false;
					document.getElementById("x_axis_tags").disabled = false;
					document.getElementById("x_axis_segment").disabled = false;
				}
			}
			// checking for gender
			if(type =='gender')
			{
				if($scope.y_axis_selected != 'gender')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.y_axis_selected 			= 'gender';
					$scope.checkboxModel.gender 	= true;

					document.getElementById("x_axis_gender").disabled = true;
					document.getElementById("x_axis_card_type").disabled = false;
					document.getElementById("x_axis_location").disabled = false;
					document.getElementById("x_axis_age_group").disabled = false;
					document.getElementById("x_axis_tags").disabled = false;
					document.getElementById("x_axis_segment").disabled = false;
				}
			}
			// checking for tags
			if(type =='tags')
			{
				if($scope.y_axis_selected != 'tags')
				{
					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.y_axis_selected 			= 'tags';
					$scope.checkboxModel.tag_details = true;
					document.getElementById("x_axis_tags").disabled = true;
					document.getElementById("x_axis_card_type").disabled = false;
					document.getElementById("x_axis_location").disabled = false;
					document.getElementById("x_axis_age_group").disabled = false;
					document.getElementById("x_axis_gender").disabled = false;
					document.getElementById("x_axis_segment").disabled = false;
				}
			}
			// checking for location
			if(type =='location')
			{
				if($scope.y_axis_selected != 'location')
				{
					console.log($scope.y_axis_selected );
					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.y_axis_selected 					= 'location';
					$scope.checkboxModel.location_details 	= true;
					document.getElementById("x_axis_tags").disabled = false;
					document.getElementById("x_axis_card_type").disabled = false;
					document.getElementById("x_axis_location").disabled = true;
					document.getElementById("x_axis_age_group").disabled = false;
					document.getElementById("x_axis_gender").disabled = false;
					document.getElementById("x_axis_segment").disabled = false;
				}
			}
			// checking for age group
			if(type =='age_group')
			{
				if($scope.y_axis_selected != 'age_grouped')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.y_axis_selected 				= 'age_grouped';
					$scope.checkboxModel.age_grouped 	= true;
					document.getElementById("x_axis_tags").disabled = false;
					document.getElementById("x_axis_card_type").disabled = false;
					document.getElementById("x_axis_location").disabled = false;
					document.getElementById("x_axis_age_group").disabled = true;
					document.getElementById("x_axis_gender").disabled = false;
					document.getElementById("x_axis_segment").disabled = false;
				}
			}
			// checking for segment
			if(type =='segment')
			{
				console.log($scope.y_axis_selected);
				if($scope.y_axis_selected != 'segment')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location_details 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'age_group')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					$scope.y_axis_selected 				= 'segment';
					$scope.checkboxModel.segment 	= true;
					document.getElementById("x_axis_tags").disabled = false;
					document.getElementById("x_axis_card_type").disabled = false;
					document.getElementById("x_axis_location").disabled = false;
					document.getElementById("x_axis_age_group").disabled = false;
					document.getElementById("x_axis_gender").disabled = false;
					document.getElementById("x_axis_segment").disabled = true;
				}
			}
		}

	}

})