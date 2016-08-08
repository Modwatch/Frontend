SearchModalController.$inject = ["$uibModalInstance", "$location", "APIService", "users"];

export default SearchModalController;

function SearchModalController($uibModalInstance, $location, APIService, users) {
  const vm = this;
  vm.users = users;

  vm.searchModlists = function(query) {
    vm.loadingModlistSearch = true;
    APIService.searchModlists(query)
    .then(users => {
      vm.modlistSearchResult = users.map(user => user.username);
      vm.loadingModlistSearch = false;
    })
    .catch(e => {
      //console.log(err);
      vm.loadingModlistSearch = false;
    });
  };

  function getUsers() {
    APIService.getUsers()
    .then(users => {
      vm.users = users.map(user => user.username);
      vm.loading = false;
    })
    .catch(e => {
      vm.loading = false;
    });
  }

  getUsers();

  vm.findUser = function(searchUser) {
    $location.path(`/u/${searchUser}`);
    vm.cancel();
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };
}
