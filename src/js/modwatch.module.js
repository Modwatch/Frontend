(() => {
  "use strict";

  angular.module("modwatch", [
    "LocalStorageModule", "ngRoute", "ngAnimate", "ui.bootstrap",
    "modwatch.api", "modwatch.wrapper"//, "modwatch.homeview",// "modwatch.userlist", "modwatch.profileview",
  ])

  .config((localStorageServiceProvider, $routeProvider, $locationProvider, $httpProvider) => {
    $routeProvider
      .when("/", {
        templateUrl: "HomeView.template.html"
      })
      .when("/u/:username", {
        templateUrl: "ProfileView.template.html",
        controller: "ProfileCtrl",
        controllerAs: "vm"
      })
      .when("/userlist", {
        templateUrl: "UserlistView.template.html",
        controller: "UserlistCtrl",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/"
      })
    ;

    $locationProvider.html5Mode(true);

    localStorageServiceProvider.setPrefix("modwatch");

    $httpProvider.interceptors.push(["$q", "$window", "$location", "localStorageService", ($q, $window, $location, localStorageService) => {
      return {
        "request": (config) => {
          config.headers = config.headers || {};
          if (localStorageService.get("token")) {
            config.headers.Authorization = "Bearer " + localStorageService.get("token");
          }
          return config;
        },
        "responseError": (response) => {
          if(response.status === 401 || response.status === 403) {
            //$window.console("signin");
          }
          return $q.reject(response);
        }
      };
    }]);
  });

})();
