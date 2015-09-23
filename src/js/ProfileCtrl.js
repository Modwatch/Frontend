(function() { "use strict";

    angular.module("modwatchApp")

    .controller("ProfileCtrl", ["$rootScope", "$scope", "$location", "$modal", "localStorageService", "Main", "$routeParams", function($rootScope, $scope, $location, $modal, localStorageService, Main, $routeParams) {

        $scope.loading = true;

        $scope.plugins = {};
        $scope.modlist = {};
        $scope.ini = {};
        $scope.prefsini = {};
        $scope.skse = {};
        $scope.enblocal = {};

        $scope.hasPlugins = false;
        $scope.hasModlist = false;
        $scope.hasIni = false;
        $scope.hasPrefsIni = false;
        $scope.skse = false;
        $scope.enblocal = false;

        var files = [];

        $scope.currentFilename = "plugins";
        $scope.modlistChecked = true;
        $scope.authenticated = false;
        $scope.user = {};
        $scope.voting = false;

        $scope.user.username = $routeParams.username;
        $rootScope.pageTitle = "Modwat.ch - " + $scope.user.username;
        $scope.user.isOwner = $scope.user.username === $scope.$parent.user.username;

        var token = localStorageService.get("token");

        var i = 0;
        var j = 0;

        if(token) {
          Main.checkToken(token,
            function(res) {
              $scope.user.isOwner = $scope.user.username === res.username;
              $scope.authenticated = true;
            }, function(err) {
              //
            }
          );
        }

        var getFile = function(res) {
          for(i = 0; i < res.length; i++) {
            res[i] = {id: "index" + i, display: res[i]};
          }
          if($scope.currentFilename === "plugins") {
            $scope.plugins = res;
            for(i = 0; i < res.length; i++) {
              if(res[i].display.indexOf("#") === 0) {
                res.splice(i, 1);
                i--;
              }
            }
          } else if($scope.currentFilename === "modlist") {
            var reversed = [];
            for (i = 0, j = res.length - 1; i < res.length; i++, j--) {
              reversed[i] = res[j];
            }
            $scope.modlist = reversed;
          } else if($scope.currentFilename === "ini") {
            $scope.ini = res;
          } else if($scope.currentFilename === "prefsini") {
            $scope.prefsini = res;
          } else if($scope.currentFilename === "skse") {
            $scope.skse = res;
          } else if($scope.currentFilename === "enblocal") {
            $scope.enblocal = res;
          }
        };

        var init = function() {
          Main.getFileNames($scope.user.username,
            function(res) {
              files = res;
              for(i = 0; i < files.length; i++) {
                //$scope.currentFilename = ($location.path().substr(1) === files[i]) ? files[i] : $scope.currentFilename;
                if(files[i] === "plugins") {
                  $scope.hasPlugins = true;
                } else if(files[i] === "modlist") {
                  $scope.hasModlist = true;
                } else if(files[i] === "ini") {
                  $scope.hasIni = true;
                } else if(files[i] === "prefsini") {
                  $scope.hasPrefsIni = true;
                } else if(files[i] === "skse") {
                  $scope.hasSKSE = true;
                } else if(files[i] === "enblocal") {
                  $scope.hasENBLocal = true;
                }
              }

              Main.getFile($scope.user.username, $scope.currentFilename,
                getFile,
                function(getFileRes) {
                  //console.log(getFileRes);
                }
              );
              Main.getProfile($scope.user.username,
                function(getProfileRes) {
                  $scope.badge = getProfileRes.badge;
                  $scope.timestamp = getProfileRes.timestamp;
                  $scope.game = getProfileRes.game;
                  $scope.enb = getProfileRes.enb;
                  $scope.tag = getProfileRes.tag;
                  $scope.score = getProfileRes.score;
                },
                function(getProfileRes) {
                  //console.log(getProfileRes);
                }
              );
            },
            function(res) {
              //console.log(res);
            }
          );
        };

        var clearToken = function() {
          localStorageService.remove("token");
          $scope.authenticated = false;
        };

        $scope.switchFiles = function(filename) {
          $scope.filterMods = undefined;
          $scope.currentFilename = filename;
          Main.getFile($scope.user.username, filename,
            getFile,
            function(res) {
              //console.log(res);
            }
          );
        };

        $scope.newTag = function(tag) {
          Main.setTag($scope.user.username, tag || $scope.tag,
            function(res) {
              console.log(res);
            },
            function(res) {
              //console.log(res);
            }
          );
        };

        $scope.newENB = function(enb) {
          Main.setENB($scope.user.username, enb || $scope.enb,
            function(res) {
              console.log(res);
            },
            function(res) {
              //console.log(res);
            }
          );
        };

        $scope.openEdit = function() {
          $modal.open({
            templateUrl: "EditModal.html",
            controller: "EditModalCtrl",
            size: "large",
            resolve: {
              user: function() {
                return $scope.user.username;
              }
            }
          });
        };
        init();

        /**
         *  Scoring Logic
         */

         $scope.upvote = function upvote(votee) {
           $scope.voting = true;
           Main.upvote(votee || $scope.user.username, token,
            function(res) {
              $scope.voting = false;
              $scope.score = res.score;
            }, function(err) {
              $scope.voting = false;
              console.log(err);
            }
          );
         };
         $scope.downvote = function downvote(votee) {
           $scope.voting = true;
           Main.downvote(votee || $scope.user.username, token,
            function(res) {
              $scope.voting = false;
              $scope.score = res.score;
            }, function(err) {
              $scope.voting = false;
              console.log(err);
            }
          );
         };
    }]);

}());
