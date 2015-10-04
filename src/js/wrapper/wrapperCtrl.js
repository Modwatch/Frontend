(() => {
  "use strict";

  angular.module("modwatch.wrapper")

  .controller("WrapperCtrl", WrapperCtrl);

  WrapperCtrl.$inject = ["$rootScope", "$scope", "$location", "$modal", "localStorageService", "APIService"];

  function WrapperCtrl($rootScope, $scope, $location, $modal, localStorageService, APIService) {

    let vm = this;

    vm.users = ["Loading..."];
    vm.loading = true;
    $rootScope.pageTitle = "Modwat.ch";

    vm.authenticated = false;
    vm.user = {};

    let token = localStorageService.get("token");

    if (token) {
      APIService.checkToken(token).then(
        (res) => {
          vm.user.username = res.data.username;
          vm.authenticated = true;
        }, (err) => {
          console.log("Token error", err);
          vm.logout();
        }
      );
    }

    let clearToken = () => {
      localStorageService.remove("token");
      vm.authenticated = false;
    };

    vm.logout = () => {
      clearToken();
      vm.user.password = undefined;
    };

    /*vm.openLogin = () => {
      let modalInstance = $modal.open({
        templateUrl: "LoginModal.html",
        controller: "LoginModalCtrl",
        size: "small",
        resolve: {
          username: () => {
            return vm.user.username;
          }
        }
      });
      modalInstance.result.then((res) => {
        vm.token = res.token;
        vm.user.username = res.username;
        vm.authenticated = true;
      });
    };

    vm.openSearch = () => {
      $modal.open({
        templateUrl: "SearchModal.html",
        controller: "SearchModalCtrl",
        size: "large",
        resolve: {
          users: () => {
            return vm.users;
          }
        }
      });
    };*/

    /*$scope.$on("$routeChangeSuccess", (ev, route) => {
      if (route.$$route.originalPath === "/") {
        $rootScope.pageTitle = "Modwat.ch - Home";
      } else if (route.$$route.originalPath === "/userlist") {
        $rootScope.pageTitle = "Modwat.ch - Search Users";
      }
    });*/

  }

})();
