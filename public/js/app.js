angular.module('project', ['ngRoute','homeController','userController','adminController','CustomerReportController','ngStorage',
                          'angularUtils.directives.dirPagination','localytics.directives','ngMap','gm','720kb.datepicker','angularBingMaps'])
 
.config(function($routeProvider) {
 
  $routeProvider
    .when('/', {
      controller:'login',
      templateUrl:'templates/login.html',
    })
    .when('/user', {
      controller:'user',
      templateUrl:'templates/user.html',
    })
    .when('/dashboard', {
      controller:'dashboard',
      templateUrl:'templates/dashboard.html',
    })
    .when('/admin', {
      controller:'admin',
      templateUrl:'templates/admin.html',
    })
    .when('/member_profile', {
      controller:'customer_profile',
      templateUrl:'templates/customer_profile.html',
    })
    .when('/offer_segment', {
      controller:'offer_segment',
      templateUrl:'templates/offer_segment.html',
    })
     .when('/customer_segment', {
      controller:'offer_segment',
      templateUrl:'templates/customer_segment.html',
    })
     .when('/customer:userId', {
      controller:'customer',
      templateUrl:'templates/customer.html',
    })

    .otherwise({
      redirectTo:'/'
    });
})
.run(function($rootScope,$location){
  $rootScope.logout_user = function(){

    // call an api and send all message to server

    localStorage.removeItem("last_login");
    localStorage.removeItem("user_type");
    localStorage.removeItem("csr_name");
    localStorage.removeItem("char_message");
    localStorage.removeItem("user_details");
    localStorage.removeItem("csr_id");
    localStorage.removeItem("customer_csr_name");
    localStorage.removeItem("token");
    $location.url("");
  }

  $rootScope.authenticateUser = function()
  {
    if(typeof localStorage.getItem("token") == 'undefined' || localStorage.getItem("token") == null || localStorage.getItem("token") == '')
    {
      alert("Please login again.");
      $location.url("");
    }
  }
  $rootScope.selected_page_pagination = '20';
  $rootScope.page_per_pagination = [
                  {name:'5', value: '5'}, 
                  {name:'10', value: '10'}, 
                  {name:'20', value: '20'}, 
                  {name:'50', value: '50'}, 
                  {name:'100', value: '100'},     
              ];
})
.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {country: 'in'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});