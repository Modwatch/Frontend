EditModalController.$inject = ["$scope", "$modalInstance", "Main", "user"];

export default EditModalController;

function EditModalController($scope, $modalInstance, Main, user) {
  $scope.user = {
    "username": user
  };

  $scope.newTag = function() {
    Main.setTag(user, $scope.tag,
      function(res) {
        //console.log(res)
      },
      function(res) {
        //console.log(res);
      }
    );
  };

  $scope.newENB = function() {
    Main.setENB(user, $scope.enb,
      function(res) {
        //
      },
      function(res) {
        //console.log(res);
      }
    );
  };

  $scope.cancel = function() {
    $modalInstance.dismiss("cancel");
  };
}
