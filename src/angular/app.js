(function() { "use strict";

  angular.module("modwatchApp", ["LocalStorageModule", "ngRoute", "ngAnimate", "ui.bootstrap"])

  .config(function (localStorageServiceProvider, $routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "HomeView.html"
      })
      .when("/u/:username", {
        templateUrl: "ProfileView.html",
        controller: "ProfileCtrl"
      })
      .when("/userlist", {
        templateUrl: "UserlistView.html",
        controller: "UserlistCtrl"
      })
      .otherwise({
        redirectTo: "/"
      })
    ;

    $locationProvider.html5Mode(true);

    localStorageServiceProvider.setPrefix("modwatch");

    $httpProvider.interceptors.push(["$q", "$window", "$location", "localStorageService", function($q, $window, $location, localStorageService) {
      return {
        "request": function (config) {
          config.headers = config.headers || {};
          if (localStorageService.get("token")) {
            config.headers.Authorization = "Bearer " + localStorageService.get("token");
          }
          return config;
        },
        "responseError": function(response) {
          if(response.status === 401 || response.status === 403) {
            //$window.console("signin");
          }
          return $q.reject(response);
        }
      };
    }]);
  });

}());
