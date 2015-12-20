LoginModalController.$inject = ["$scope", "$modalInstance", "localStorageService", "APIService", "username"];

export default LoginModalController;

function LoginModalController($scope, $modalInstance, localStorageService, APIService, username) {
  $scope.user = {};
  $scope.user.username = username;
  $scope.authenticated = false;
  $scope.loadingModlistSearch = false;

  var clearToken = function() {
    localStorageService.remove("token");
    $scope.authenticated = false;
  };

  $scope.login = function() {
    clearToken();
    if ($scope.user.username && $scope.user.password) {
      APIService.signIn($scope.user.username, $scope.user.password,
        function(res) {
          $scope.loginError = undefined;
          localStorageService.set("token", res.token);
          $scope.authenticated = true;
          $modalInstance.close({
            "token": $scope.token,
            "username": $scope.user.username
          });
        },
        function(err) {
          $scope.loginError = "Oh no, that login didn't work!";
        }
      );
    }
  };
  $scope.cancel = function() {
    $modalInstance.dismiss("cancel");
  };
}
