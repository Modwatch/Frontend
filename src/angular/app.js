(function() {

  angular.module('modwatchApp', ["LocalStorageModule", "ui.bootstrap"])

  .config(function (localStorageServiceProvider, $httpProvider) {
    localStorageServiceProvider.setPrefix('modwatch');

    $httpProvider.interceptors.push(['$q', '$window', 'localStorageService', function($q, $window, $location, localStorageService) {
      return {
        'request': function (config) {
          config.headers = config.headers || {};
          if (localStorageService.get("token")) {
            config.headers.Authorization = 'Bearer ' + localStorageService.get("token");
          }
          return config;
        },
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $window.console("signin");
          }
          return $q.reject(response);
        }
      };
    }]);
  });

}());