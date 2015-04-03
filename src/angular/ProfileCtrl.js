(function() {

    angular.module('modwatchApp')

    .controller('ProfileCtrl', ['$scope', '$location', 'localStorageService', 'Main', '$routeParams', function($scope, $location, localStorageService, Main, $routeParams) {

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
        
        console.log($scope.user.username);

        var token = localStorageService.get("token");

        if(token) {
          Main.checkToken(token,
            function(res) {
              $scope.authenticated = true;
            }, function(err) {
              //
            }
          );
        }

        var init = function() {
          Main.getFileNames($scope.user.username,
            function(res) {
              files = res;
              for(var i = 0; i < files.length; i++) {
                //$scope.currentFilename = ($location.path().substr(1) === files[i]) ? files[i] : $scope.currentFilename;
                if(files[i] === 'plugins') {
                  $scope.hasPlugins = true;
                } else if(files[i] === 'modlist') {
                  $scope.hasModlist = true;
                } else if(files[i] === 'ini') {
                  $scope.hasIni = true;
                } else if(files[i] === 'prefsini') {
                  $scope.hasPrefsIni = true;
                } else if(files[i] === 'skse') {
                  $scope.hasSKSE = true;
                } else if(files[i] === 'enblocal') {
                  $scope.hasENBLocal = true;
                }
              }
              //$location.path($scope.currentFilename);

              Main.getFile($scope.user.username, $scope.currentFilename,
                getFile,
                function(res) {
                  console.log(res);
                }
              );
              Main.getProfile($scope.user.username,
                function(res) {
                  $scope.badge = res.badge;
                  $scope.timestamp = res.timestamp;
                  $scope.game = res.game;
                  $scope.enb = res.enb;
                  $scope.tag = res.tag;
                },
                function(res) {
                  console.log(res);
                }
              );
            },
            function(res) {
              console.log(res);
            }
          );
        };

        var getFile = function(res) {
          if($scope.currentFilename === 'plugins') {
            $scope.plugins = res;
          } else if($scope.currentFilename === 'modlist') {
            console.log(res);
            var reversed = [];
            for (var i = 0, j = res.length-1; i < res.length; i++,j--) {
              reversed[i] = res[j];
            }
            $scope.modlist = reversed;
          } else if($scope.currentFilename === 'ini') {
            addDesc(res);
            $scope.ini = res;
          } else if($scope.currentFilename === 'prefsini') {
            addDesc(res);
            $scope.prefsini = res;
          } else if($scope.currentFilename === 'skse') {
            addDesc(res);
            $scope.skse = res;
          } else if($scope.currentFilename === 'enblocal') {
            addDesc(res);
            $scope.enblocal = res;
          }
        };

        var addDesc = function(res) {
          for(var i = 0; i < res.length; i++) {
            if(res[i].name.indexOf(';') >= 0) {
              console.log(res[i].name.indexOf(';'));
              res[i].desc = res[i].name.substr(res[i].name.indexOf(';'));
              res[i].name = res[i].name.substr(0, res[i].name.indexOf(';')-1);
              res[i].style = {"color":"rgb(0,0,180)"};
            } else {
              res[i].style = {};
            }
          }
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
              console.log(res);
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
        
        init();

    }]);

}());