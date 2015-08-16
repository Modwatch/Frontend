(function() { "use strict";

    angular.module("modwatchApp")
    /*globals paginate localStorageService*/

    .controller("UserlistCtrl", ["$scope", "localStorageService", "$filter", "Main", function($scope, localStorageService, $filter, Main) {

        $scope.loading = true;

        var filter = $filter("filter");
        var orderBy = $filter("orderBy");
        var currentList = [];
        var filterLocked = false;

        $scope.users = currentList = localStorageService.get("userlist") || [];
        $scope.cachedList = currentList.length === 0 ? false : true;
        $scope.listFilter = ""; // filter input
        $scope.listOrder = {
          field: "username",
          reverse: false
        };

        $scope.sortCol = function sortCol(field) {
          if(field === $scope.listOrder.field) {
            $scope.listOrder.reverse = !$scope.listOrder.reverse;
          } else {
            $scope.listOrder.field = field;
            $scope.listOrder.reverse = false;
          }
        };

        var paginateDataFunction = function paginateDataFunction() {
          if(!filterLocked) {
            currentList = orderBy(filter($scope.users, $scope.listFilter), $scope.listOrder.field, $scope.listOrder.reverse);
          }
          filterLocked = true;
          return currentList;
        };
        $scope.pList = paginate(10, paginateDataFunction);

        var i = 0;
        var j = 0;

        $scope.getUserlist = function getUserlist() {
          Main.getUsers(
            function (userlist) {
              $scope.users = userlist;
              for(i = 0; i < $scope.users.length; i++) {
                if($scope.users[i].username === "") {
                  $scope.users.splice(i, 1);
                  i--;
                }
              }
              localStorageService.set("userlist", userlist);
              filterLocked = $scope.cachedList = false;
            },
            function (err) {
              console.log(err);
            }
          );
        };
        $scope.getUserlist();

        $scope.$watch("listFilter", function(newVal, oldVal) {
          console.log("ok?");
          if(newVal !== oldVal) {
            filterLocked = false;
          }
        });
    }]);

}());
