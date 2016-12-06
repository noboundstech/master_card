angular.module('CustomerReportController', ['applicationService.services'])
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
	$scope.show_by_offer = true;
	$scope.checkboxModel.offer_segment_search_by = "offer_id";
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
			$scope.merchat_details 	= response.data.response_data.merchant;

			//	$scope.getNewChatDetails();
		}
		else
		{
			// show error message
		}
		
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});
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
			if(type =='age_grouped')
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
			if(type =='age_grouped')
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
					if($scope.y_axis_selected == 'age_grouped')
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
	$scope.getCustomerSegmentDetails = function()
	{
		$scope.show_loader 						= true;
		$scope.card_type_selected_details 		= [];
		$scope.segment_selected_details 		= [];
		$scope.age_grouped_selected_details 	= [];
		$scope.location_filter_selected_details = [];
		$scope.selected_axis_details    		= 0;    
		if($scope.x_axis_selected == 'card_type' || $scope.y_axis_selected == 'card_type')
		{
			if(typeof $scope.card_type_filter_details !='undefined')
			{
				for(i=0;i<$scope.card_type_filter_details.length;i++)
				{
					$scope.card_type_selected_details.push({"name" : $scope.card_type_filter_details[i].card_type});
				}
				if($scope.card_type_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'gender' || $scope.y_axis_selected == 'gender')
		{
			if(typeof $scope.gender_type_filter != 'undefined')
			{
				if($scope.gender_type_filter.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'tags' || $scope.y_axis_selected == 'tags')
		{
			if(typeof $scope.tag_details_filter != 'undefined')
			{
				if($scope.tag_details_filter.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'age_grouped' || $scope.y_axis_selected == 'age_grouped')
		{
			if(typeof $scope.age_group_filter !='undefined')
			{
				for(i=0;i<$scope.age_group_filter.length;i++)
				{
					$scope.age_grouped_selected_details.push({"name" : $scope.age_group_filter[i].value});
				}
				if($scope.age_grouped_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'location' || $scope.y_axis_selected == 'location')
		{
			if(typeof $scope.location_filter !='undefined')
			{
				for(i=0;i<$scope.location_filter.length;i++)
				{
					$scope.location_filter_selected_details.push({"name" : $scope.location_filter[i].cust_location});
				}
				if($scope.location_filter_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'segment' || $scope.y_axis_selected == 'segment')
		{
			if(typeof $scope.segment_filter !='undefined')
			{
				for(i=0;i<$scope.segment_filter.length;i++)
				{
					$scope.segment_selected_details.push({"name" : $scope.segment_filter[i].cust_segment});
				}
				if($scope.location_filter_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
			}
		}

		if($scope.selected_axis_details<2)
		{
			//alert("Please Select both "+$scope.x_axis_selected+" and "+$scope.y_axis_selected+" options");
			//return false;
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
				var message = '';
			}
			else
			{
				var message = response.data.response_data.message;
			}

			var  category		= response.data.response_data.Graph_data[0].x_axis_name;
			var chart_details 	= response.data.response_data.Graph_data[0].y_array_header;

			Highcharts.chart('container', {

		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: message
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
			
		}, function errorCallback(response) {
			$scope.show_loader = false;
		});
	}
	$scope.changeofferSearchStatus = function(val)
	{
		if(val == 'change_to_offer_id')
		{
			$scope.show_by_offer = true;
			$scope.checkboxModel.offer_segment_search_by = "offer_id";
		}
		else
		{
			if(val =='offer_id')
			{
				$scope.show_by_offer = true;
				$scope.offer_id = '';
			//	$scope.checkboxModel.offer_segment_search_by = "customer_id";
			}
			else
			{
				$scope.show_by_offer = false;
			//	$scope.checkboxModel.offer_segment_search_by = "customer_id";
			}
		}
	}
	$scope.getOfferSegmentDetails = function()
	{
		$scope.show_loader = true;
		$scope.card_type_selected_details = [];
		$scope.segment_selected_details = [];
		$scope.age_grouped_selected_details = [];
		$scope.location_filter_selected_details = [];
		$scope.selected_offer_axis_details    	= 0; 
		if(typeof $scope.offer_id == 'undefined' || $scope.offer_id == '' || $scope.offer_id == null)
		{
			alert("Please Enter your offer Id.");
			return false;
		}
		if($scope.x_axis_selected == 'card_type' || $scope.y_axis_selected == 'card_type')
		{
			if(typeof $scope.card_type_filter_details != 'undefined')
			{
				for(i=0;i<$scope.card_type_filter_details.length;i++)
				{
					$scope.card_type_selected_details.push({"name" : $scope.card_type_filter_details[i].card_type});
				}
				if($scope.card_type_filter_details.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'gender' || $scope.y_axis_selected == 'gender')
		{
			if(typeof $scope.gender_type_filter != 'undefined')
			{
				if($scope.gender_type_filter.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'age_grouped' || $scope.y_axis_selected == 'age_grouped')
		{
			if(typeof $scope.age_group_filter != 'undefined')
			{
				for(i=0;i<$scope.age_group_filter.length;i++)
				{
					$scope.age_grouped_selected_details.push({"name" : $scope.age_group_filter[i].value});
				}
				if($scope.age_grouped_selected_details.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'location' || $scope.y_axis_selected == 'location')
		{
			if(typeof $scope.card_type_filter_details != 'undefined')
			{
				for(i=0;i<$scope.location_filter.length;i++)
				{
					$scope.location_filter_selected_details.push({"name" : $scope.location_filter[i].cust_location});
				}
				if($scope.location_filter_selected_details.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'segment' || $scope.y_axis_selected == 'segment')
		{
			if(typeof $scope.segment_filter != 'undefined')
			{
				for(i=0;i<$scope.segment_filter.length;i++)
				{
					$scope.segment_selected_details.push({"name" : $scope.segment_filter[i].cust_segment});
				}
				if($scope.segment_selected_details.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.x_axis_selected == 'tags' || $scope.y_axis_selected == 'tags')
		{
			if(typeof $scope.tag_details_filter != 'undefined')
			{
				if($scope.tag_details_filter.length>0)
				{
					$scope.selected_offer_axis_details++;
				}
			}
		}
		if($scope.selected_offer_axis_details<2)
		{
			alert("Please Select both "+$scope.x_axis_selected+" and "+$scope.y_axis_selected+" options");
			return false;
		}
		$scope.request_details = {
									"card_type"		: $scope.card_type_selected_details,
									"tags"			: $scope.tag_details_filter,
									"offer_id"		: $scope.offer_id,
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

		API.postDetails($scope.request_details,"customer_segment/getOfferSegReportData").then(function successCallback(response) {
			$scope.show_loader = false;
			var  category		= response.data.response_data.Graph_data[0].x_axis_name;
			var chart_details 	= response.data.response_data.Graph_data[0].y_array_header;
			if(response.status == 203)
			{
				var message = response.data.response_data.message;
			}
			else
			{
				var message = ''; 
			}
				
			Highcharts.chart('container', {

		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: message
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
			
		}, function errorCallback(response) {
			$scope.show_loader = false;
		});
	}
	$scope.getOfferDetails = function()
	{
		$scope.show_merchant_loader = true;
		API.postDetails({merchant_id : $scope.merchant_details},"api/getMerchantOffer").then(function successCallback(response) {
			$scope.show_merchant_loader = false;
			$scope.offer_details = response.data.response_data.details;
		}, function errorCallback(response) {
			
		});
	}
})