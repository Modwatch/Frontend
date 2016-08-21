SettingsController.$inject = ["APIService"];

export default SettingsController;

function SettingsController(APIService) {

  const vm = this;
  vm.changepass = changepass;

  function changepass(password) {
    APIService.changepass(password)
    .then(r => {
      console.log("Changed", r);
    })
    .catch(e => {
      console.log("Error", e);
    })
  }

}
