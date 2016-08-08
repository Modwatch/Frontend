LoginModalController.$inject = ["$uibModalInstance", "localStorageService", "APIService", "username"];

export default LoginModalController;

function LoginModalController($uibModalInstance, localStorageService, APIService, username) {
  const vm = this;
  vm.user = {
    username
  };
  vm.authenticated = false;
  vm.loadingModlistSearch = false;

  var clearToken = function() {
    localStorageService.remove("token");
    vm.authenticated = false;
  };

  vm.login = function() {
    clearToken();
    if (vm.user.username && vm.user.password) {
      APIService.signIn(vm.user.username, vm.user.password)
      .then(token => {
        vm.loginError = undefined;
        localStorageService.set("token", token);
        vm.authenticated = true;
        $uibModalInstance.close({
          "token": vm.token,
          "username": vm.user.username
        });
      })
      .catch(e => {
        vm.loginError = "Oh no, that login didn't work!";
      });
    }
  };
  vm.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };
}
