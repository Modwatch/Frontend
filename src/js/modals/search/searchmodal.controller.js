SearchModalController.$inject = ["$scope", "$modalInstance", "$location", "APIService", "users"];

export default SearchModalController;

function SearchModalController($scope, $modalInstance, $location, APIService, users) {
  $scope.users = users;

  $scope.searchModlists = function(query) {
    $scope.loadingModlistSearch = true;
    APIService.searchModlists(query,
      function(list) {
        $scope.modlistSearchResult = list.users;
        $scope.loadingModlistSearch = false;
      },
      function(err) {
        //console.log(err);
        $scope.loadingModlistSearch = false;
      }
    );
  };

  var getUsers = function() {
    APIService.getUsers(
      function(res) {
        $scope.users = res.usernames;
        $scope.loading = false;
      },
      function(res) {
        //console.log(res);
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
}
