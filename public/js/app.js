angular.module('project', ['ngRoute','homeController','userController','ngStorage','localytics.directives','ngMap','gm','720kb.datepicker','angularBingMaps'])
 
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
    .when('/customer_profile', {
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
    localStorage.removeItem("user_details")
    $location.url("");
  }
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