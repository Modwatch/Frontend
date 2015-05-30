(function() { "use strict";

    angular.module("modwatchApp")

    .controller("ProfileCtrl", ["$scope", "$location", "$modal", "localStorageService", "Main", "$routeParams", function($scope, $location, $modal, localStorageService, Main, $routeParams) {

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

        $scope.user.username = $routeParams.username;
        $scope.user.isOwner = $scope.user.username === $scope.$parent.user.username;

        var defaultIni = "[General]\nsLanguage=ENGLISH\n\nuExterior Cell Buffer=36\n\n[Display]\nfShadowLODMaxStartFade=1000.0\nfSpecularLODMaxStartFade=2000.0\nfLightLODMaxStartFade=3500.0\niShadowMapResolutionPrimary=2048\nbAllowScreenshot=1\n\n[Audio]\nfMusicDuckingSeconds=6.0\nfMusicUnDuckingSeconds=8.0\nfMenuModeFadeOutTime=3.0\nfMenuModeFadeInTime=1.0\n\n[Grass]\nbAllowCreateGrass=1\nbAllowLoadGrass=0\n\n[GeneralWarnings]\nSGeneralMasterMismatchWarning=One or more plugins could not find the correct versions of the master files they depend on. Errors may occur during load or game play. Check the \"Warnings.txt\" file for more information.\n\n[Archive]\nsResourceArchiveList=Skyrim - Misc.bsa, Skyrim - Shaders.bsa, Skyrim - Textures.bsa, Skyrim - Interface.bsa, Skyrim - Animations.bsa, Skyrim - Meshes.bsa, Skyrim - Sounds.bsa\nsResourceArchiveList2=Skyrim - Voices.bsa, Skyrim - VoicesExtra.bsa\n\n[Combat]\nfMagnetismStrafeHeadingMult=0.0\nfMagnetismLookingMult=0.0\n\n[Papyrus]\nfPostLoadUpdateTimeMS=500.0\nbEnableLogging=0\nbEnableTrace=0\nbLoadDebugInformation=0\n[Water]\nbReflectLODObjects=1\nbReflectLODLand=1\nbReflectSky=1\nbReflectLODTrees=1";

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

        var addDesc = function(res) {
          for(i = 0; i < res.length; i++) {
            if(res[i].name.indexOf(";") >= 0) {
              res[i].desc = res[i].name.substr(res[i].name.indexOf(";"));
              res[i].name = res[i].name.substr(0, res[i].name.indexOf(";") - 1);
              res[i].style = {"color": "rgb(0,0,180)"};
            } else {
              res[i].style = {};
            }
          }
        };

        var getFile = function(res) {
          if($scope.currentFilename === "plugins") {
            $scope.plugins = res;
          } else if($scope.currentFilename === "modlist") {
            var reversed = [];
            for (i = 0, j = res.length - 1; i < res.length; i++, j--) {
              reversed[i] = res[j];
            }
            $scope.modlist = reversed;
          } else if($scope.currentFilename === "ini") {
            addDesc(res);
            var tmpIniString = [];
            for(i = 0; i < res.length; i++) {
              tmpIniString.push(res[i].name);
            }
            console.log(JsDiff.diffTrimmedLines(defaultIni, tmpIniString.join("\n")));
            $scope.ini = res;
          } else if($scope.currentFilename === "prefsini") {
            addDesc(res);
            $scope.prefsini = res;
          } else if($scope.currentFilename === "skse") {
            addDesc(res);
            $scope.skse = res;
          } else if($scope.currentFilename === "enblocal") {
            addDesc(res);
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
              //$location.path($scope.currentFilename);

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
                },
                function(getProfileRes) {
                  console.log(getProfileRes);
                }
              );
            },
            function(res) {
              console.log(res);
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
          //$location.path(filename);
          Main.getFile($scope.user.username, filename,
            getFile,
            function(res) {
              //console.log(res);
            }
          );
        };

        $scope.newTag = function() {
          Main.setTag($scope.user.username, $scope.tag,
            function(res) {
              //console.log(res)
            },
            function(res) {
              console.log(res);
            }
          );
        };

        $scope.newENB = function() {
          Main.setENB($scope.user.username, $scope.enb,
            function(res) {
              //
            },
            function(res) {
              console.log(res);
            }
          );
        };

        $scope.openEdit = function() {
          $modal.open({
            templateUrl: "templates/EditModal.html",
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

    }]);

}());
