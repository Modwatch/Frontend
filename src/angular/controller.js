(function() {

    angular.module('modwatchApp')

    .controller('MainCtrl', ['$scope', '$location', '$modal', 'localStorageService', 'Main', function($scope, $location, $modal, localStorageService, Main) {

        $scope.users = ['Loading...'];
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

        var token = localStorageService.get("token");

        if(token) {
          Main.checkToken(token,
            function(res) {
              $scope.user.username = res.username;
              $scope.authenticated = true;
            }, function(err) {
              $scope.logout();
              console.log("invalid token");
            }
          );
        }

        $scope.getUsers = function() {
          Main.getUsers(
            function(res) {
                $scope.users = res.usernames;
                $scope.loading = false;
            },
            function(res) {
                console.log(res);
                $scope.loading = false;
            }
          );
        };

        $scope.searchModlists = function(query) {
          Main.searchModlists(query,
            function(list) {
              console.log(list);
            }, function(err) {
              console.log(err);
            }
          );
        };

        $scope.init = function() {
          Main.getFileNames($scope.user.username,
            function(res) {
              files = res;
              for(var i = 0; i < files.length; i++) {
                $scope.currentFilename = ($location.path().substr(1) === files[i]) ? files[i] : $scope.currentFilename;
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
              $location.path($scope.currentFilename);

              Main.getFile(username,$scope.currentFilename,
                getFile,
                function(res) {
                  console.log(res);
                }
              );
              Main.getProfile(username,
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

        $scope.logout = function() {
          clearToken();
          $scope.user.password = undefined;
        };

        $scope.switchFiles = function(filename) {
          $scope.filterMods = undefined;
          $scope.currentFilename = filename;
          $location.path(filename);
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
        
        $scope.openLogin = function() {
          console.log($scope.user.username);
          var modalInstance = $modal.open({
            templateUrl: 'loginModal.html',
            controller: 'LoginModalCtrl',
            size: "small",
            resolve: {
              username: function() {
                return $scope.user.username;
              }
            }
          });
          modalInstance.result.then(function (res) {
            $scope.token = res.token;
            $scope.user.username = res.username;
            $scope.authenticated = true;
          });
        };

    }])
    .controller("LoginModalCtrl", ["$scope","$modalInstance", 'localStorageService', 'Main', "username", function($scope, $modalInstance, localStorageService, Main, username) {
      $scope.user = {};
      $scope.user.username = username;
      $scope.authenticated = false;
      
      var clearToken = function() {
          localStorageService.remove("token");
          $scope.authenticated = false;
        };
      

        $scope.login = function() {
          clearToken();
          if($scope.user.username && $scope.user.password) {
            Main.signIn($scope.user.username, $scope.user.password,
              function(res) {
                localStorageService.set("token", res.token);
                $scope.authenticated = true;
                $modalInstance.close({"token": $scope.token, "username": $scope.user.username});
              }, function(err) {
                console.log(res);
              }
            );
          }
        };
        $scope.cancel = function() {
          $modalInstance.dismiss("cancel");
        };
    }])
    .controller("SearchModalCtrl", ["$scope","$modalInstance", "Main", function($scope, $modalInstance, Main) {

        $scope.login = function() {
          clearToken();
          if($scope.user.username && $scope.user.password) {
            Main.signIn($scope.user.username, $scope.user.password,
              function(res) {
                localStorageService.set("token", res.token);
                $scope.authenticated = true;
                $modalInstance.close({"token": $scope.token, "username": $scope.user.username});
              }, function(err) {
                console.log(res);
              }
            );
          }
        };
        $scope.cancel = function() {
          $modalInstance.dismiss("cancel");
        };
    }])
    /**
     *  Filters
     */
    .filter('stripedList', function() {
      return function(input, match) {
        match = match?match.toLowerCase():undefined;
        var filtered = [];
        for(var i = 0, j = 0; i < input.length; i++) {
          if(!match || input[i].name.toLowerCase().indexOf(match) >= 0) {
            filtered.push(input[i]);
            filtered[filtered.length-1].class = (j===0)?"whited":"greyed";
            j = (j+1)%2;
          }
        }
        return filtered;
      };
    })
    .filter('checked', function() {
      return function(input, toggle) {
        if(!toggle) {
          return input;
        } else {
          var filtered = [];
          for(var i = 0; i < input.length; i++) {
            if(input[i].name.indexOf('-') !== 0) {
              filtered.push(input[i]);
            }
          }
          return filtered;
        }
      };
    })
    .filter('capitalize', function() {
      return function(input) {
        return input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
      };
    })
    .filter('modwatchLimitTo', function() {
      return function(input, limit) {
        return (input && input.length > limit) ? (input.substr(0,limit) + '...') : input;
      };
    });

}());