(function() { "use strict";

    angular.module("modwatchApp")

    .controller("MainCtrl", ["$rootScope", "$scope", "$location", "$modal", "localStorageService", "Main", function($rootScope, $scope, $location, $modal, localStorageService, Main) {

        $scope.users = ["Loading..."];
        $scope.loading = true;
        $rootScope.pageTitle = "Modwat.ch";

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
            templateUrl: "LoginModal.template.html",
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
            templateUrl: "SearchModal.template.html",
            controller: "SearchModalCtrl",
            size: "large",
            resolve: {
              users: function() {
                return $scope.users;
              }
            }
          });
        };

        $scope.$on("$routeChangeSuccess", function(ev, route) {
          if(route.$$route.originalPath === "/") {
            $rootScope.pageTitle = "Modwat.ch - Home";
          } else if(route.$$route.originalPath === "/userlist") {
            $rootScope.pageTitle = "Modwat.ch - Search Users";
          }
        });

    }]);

}());
