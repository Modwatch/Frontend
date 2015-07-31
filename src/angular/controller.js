(function() { "use strict";

    angular.module("modwatchApp")

    .controller("MainCtrl", ["$scope", "$location", "$modal", "localStorageService", "Main", function($scope, $location, $modal, localStorageService, Main) {

        $scope.users = ["Loading..."];
        $scope.loading = true;

        $scope.plugins = {};
        $scope.modlist = {};
        $scope.ini = {};
        $scope.prefsini = {};
        $scope.skse = {};
        $scope.enblocal = {};

        $scope.hasPlugins = false;
        $scope.hasModlist = false;
        $scope.hasIni = false;
        $scope.hasPrefsIni = false;
        $scope.skse = false;
        $scope.enblocal = false;

        var files = [];

        $scope.currentFilename = "plugins";
        $scope.modlistChecked = true;
        $scope.authenticated = false;
        $scope.user = {};

        var token = localStorageService.get("token");

        if(token) {
          Main.checkToken(token,
            function(res) {
              $scope.user.username = res.username;
              $scope.authenticated = true;
            }, function(err) {
              $scope.logout();
              //console.log("invalid token");
            }
          );
        }

        var clearToken = function() {
          localStorageService.remove("token");
          $scope.authenticated = false;
        };

        $scope.logout = function() {
          clearToken();
          $scope.user.password = undefined;
        };

        $scope.openLogin = function() {
          var modalInstance = $modal.open({
            templateUrl: "LoginModal.html",
            controller: "LoginModalCtrl",
            size: "small",
            resolve: {
              username: function() {
                return $scope.user.username;
              }
            }
          });
          modalInstance.result.then(function (res) {
            $scope.token = res.token;
            $scope.user.username = res.username;
            $scope.authenticated = true;
          });
        };

        $scope.openSearch = function() {
          $modal.open({
            templateUrl: "SearchModal.html",
            controller: "SearchModalCtrl",
            size: "large",
            resolve: {
              users: function() {
                return $scope.users;
              }
            }
          });
        };

    }])
    /**
     *  Filters
     */
    .filter("stripedList", function() {
      return function(input, match) {
        match = match ? match.toLowerCase() : undefined;
        var filtered = [];
        for(var i = 0, j = 0; i < input.length; i++) {
          if(!match || input[i].name.toLowerCase().indexOf(match) >= 0) {
            filtered.push(input[i]);
            filtered[filtered.length - 1].class = (j === 0) ? "whited" : "greyed";
            j = (j + 1) % 2;
          }
        }
        return filtered;
      };
    })
    .filter("checked", function() {
      return function(input, toggle) {
        if(!toggle) {
          return input;
        } else {
          var filtered = [];
          for(var i = 0; i < input.length; i++) {
            if(input[i].name.indexOf("-") !== 0) {
              filtered.push(input[i]);
            }
          }
          return filtered;
        }
      };
    })
    .filter("capitalize", function() {
      return function(input) {
        return input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
      };
    })
    .filter("modwatchLimitTo", function() {
      return function(input, limit) {
        return (input && input.length > limit) ? (input.substr(0, limit) + "...") : input;
      };
    });

}());
