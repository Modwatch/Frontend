WrapperController.$inject = ["$rootScope", "$scope", "$location", "ModalService", "localStorageService", "APIService"];

export default WrapperController;

function WrapperController($rootScope, $scope, $location, ModalService, localStorageService, APIService) {

  let vm = this;

  vm.users = ["Loading..."];
  vm.loading = true;
  $rootScope.pageTitle = "Modwat.ch";

  vm.authenticated = false;
  vm.user = {};

  let token = localStorageService.get("token");

  if (token) {
    APIService.checkToken(token)
    .then(res => {
      console.log(res);
      vm.user.username = res.data.username;
      vm.authenticated = true;
    })
    .catch(e => {
      console.log("Token error", e);
      vm.logout();
    });
  }

  let clearToken = () => {
    localStorageService.remove("token");
    vm.authenticated = false;
  };

  vm.logout = () => {
    clearToken();
    vm.user.password = undefined;
  };

  vm.openLogin = () => {
    ModalService.login({
        username: () => {
          return vm.user.username;
        }
      }, (res) => {
        console.log(res);
        vm.token = res.token;
        vm.user.username = res.username;
        vm.authenticated = true;
      }
    );
  };

  vm.openSearch = () => {
    ModalService.search({
      users: () => {
        return vm.users;
      }
    });
  };

  /*$scope.$on("$routeChangeSuccess", (ev, route) => {
    if (route.$$route.originalPath === "/") {
      $rootScope.pageTitle = "Modwat.ch - Home";
    } else if (route.$$route.originalPath === "/userlist") {
      $rootScope.pageTitle = "Modwat.ch - Search Users";
    }
  });*/

}
