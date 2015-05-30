describe("Controllers", function() { "use strict";

  beforeEach(module("modwatchApp"));

  describe("MainCtrl", function() {

    var $scope;
    var mainCtrl;

    beforeEach(inject(function($rootScope, $controller) {
      $scope = {};
      $scope = $rootScope.$new();
      mainCtrl = $controller("MainCtrl", {$scope: $scope});

    }));

    it("should initialize some values", function() {
      expect($scope.modlistChecked).toEqual(true);
    });
  });
});
