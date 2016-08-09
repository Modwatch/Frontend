import paginate from "@ansballard/paginate";

UserlistController.$inject = ["localStorageService", "$filter", "APIService"];

export default UserlistController;

function UserlistController(localStorageService, $filter, APIService) {

  const vm = this;

  vm.loading = true;
  vm.searchUsers = searchUsers;
  vm.searchModlists = searchModlists;

  let filter = $filter("filter");
  let orderBy = $filter("orderBy");
  let currentList = [];
  let filterLocked = false;

  vm.users = currentList = [];
  vm.listOrder = {
    field: "timestamp",
    reverse: true
  };

  vm.unlockFilter = () => {
    vm.filterLocked = false;
  };
  function searchUsers(query) {
    vm.loading = true;
    APIService.getUsers({query, limit: 100})
    .then(users => {
      vm.users = currentList = users;
      vm.loading = false;
      filterLocked = false;
    })
    .catch(e => {
      vm.loading = false;
    });
  }
  function searchModlists(query) {
    vm.loading = true;
    APIService.searchModlists(query)
    .then(res => {
      vm.users = currentList = res.newUsers;
      vm.loading = false;
      filterLocked = false;
    })
    .catch(e => {
      vm.loading = false;
    });
  };
  searchUsers();

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
      currentList = orderBy(vm.users, vm.listOrder.field, vm.listOrder.reverse);
    }
    filterLocked = true;
    return currentList;
  };
  vm.pList = paginate(10, paginateDataFunction);
}
