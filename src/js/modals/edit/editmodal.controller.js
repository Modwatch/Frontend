EditModalController.$inject = ["$modalInstance", "Main", "user"];

export default EditModalController;

function EditModalController($modalInstance, Main, user) {
  vm.user = {
    "username": user
  };

  vm.newTag = function() {
    Main.setTag(user, vm.tag)
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
  };

  vm.newENB = function() {
    Main.setENB(user, vm.enb)
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
  };

  vm.cancel = function() {
    $modalInstance.dismiss("cancel");
  };
}
