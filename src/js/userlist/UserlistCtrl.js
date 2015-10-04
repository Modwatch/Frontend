(() => {
  "use strict";

  angular.module("modwatch.userlist")
    /*globals paginate localStorageService*/

  .controller("UserlistCtrl", UserlistCtrl);

  UserlistCtrl.$inject = ["localStorageService", "$filter", "APIService"];

  function UserlistCtrl(localStorageService, $filter, APIService) {

    let vm = this;

    vm.loading = true;

    let filter = $filter("filter");
    let orderBy = $filter("orderBy");
    let currentList = [];
    let filterLocked = false;

    vm.users = currentList = localStorageService.get("userlist") || [];
    vm.cachedList = currentList.length === 0 ? false : true;
    vm.listFilter = ""; // filter input
    vm.listOrder = {
      field: "timestamp",
      reverse: true
    };

    vm.unlockFilter = () => {
      vm.filterLocked = false;
    };

    vm.sortCol = (field) => {
      if (field === vm.listOrder.field) {
        vm.listOrder.reverse = !vm.listOrder.reverse;
      } else {
        vm.listOrder.field = field;
        vm.listOrder.reverse = false;
      }
      filterLocked = false;
    };

    let paginateDataFunction = () => {
      if (!filterLocked) {
        currentList = orderBy(filter(vm.users, vm.listFilter), vm.listOrder.field, vm.listOrder.reverse);
      }
      filterLocked = true;
      return currentList;
    };
    vm.pList = paginate(10, paginateDataFunction);

    let i = 0;
    let j = 0;

    vm.getUserlist = () => {
      APIService.getUsers().then(
        (userlist) => {
          vm.users = userlist.data;
          for (i = 0; i < vm.users.length; i++) {
            if (vm.users[i].username === "") {
              vm.users.splice(i, 1);
              i--;
            }
          }
          localStorageService.set("userlist", userlist);
          filterLocked = vm.cachedList = false;
        },
        (err) => {
          console.log(err);
        }
      );
    };
    vm.getUserlist();
  }

})();
