(function() {

    angular.module('modwatchApp')
    .controller("LoginModalCtrl", ["$scope","$modalInstance", 'localStorageService', 'Main', "username", function($scope, $modalInstance, localStorageService, Main, username) {
      $scope.user = {};
      $scope.user.username = username;
      $scope.authenticated = false;
      
      var clearToken = function() {
          localStorageService.remove("token");
          $scope.authenticated = false;
        };

        $scope.login = function() {
          clearToken();
          if($scope.user.username && $scope.user.password) {
            Main.signIn($scope.user.username, $scope.user.password,
              function(res) {
                localStorageService.set("token", res.token);
                $scope.authenticated = true;
                $modalInstance.close({"token": $scope.token, "username": $scope.user.username});
              }, function(err) {
                console.log(res);
              }
            );
          }
        };
        $scope.cancel = function() {
          $modalInstance.dismiss("cancel");
        };
    }])
    .controller("SearchModalCtrl", ["$scope","$modalInstance", "$location", "Main", "users", function($scope, $modalInstance, $location, Main, users) {
        $scope.users = users;

        $scope.searchModlists = function(query) {
          Main.searchModlists(query,
            function(list) {
              //console.log(list);
            }, function(err) {
              console.log(err);
            }
          );
        };

        var getUsers = function() {
          Main.getUsers(
            function(res) {
                $scope.users = res.usernames;
                $scope.loading = false;
            },
            function(res) {
                console.log(res);
                $scope.loading = false;
            }
          );
        };
        
        getUsers();
        
        $scope.findUser = function(searchUser) {
          $location.path("/u/" + searchUser);
          $scope.cancel();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss("cancel");
        };
    }])
    .controller("EditModalCtrl", ["$scope", "$modalInstance", "Main", "user", function($scope, $modalInstance, Main, user) {
        $scope.user = {
          "username": user
        };

        $scope.newTag = function() {
          Main.setTag(user, $scope.tag,
            function(res) {
              //console.log(res)
            },
            function(res) {
              console.log(res);
            }
          );
        };

        $scope.newENB = function() {
          Main.setENB(user, $scope.enb,
            function(res) {
              //
            },
            function(res) {
              console.log(res);
            }
          );
        };

        $scope.cancel = function() {
          $modalInstance.dismiss("cancel");
        };
    }]);

}());