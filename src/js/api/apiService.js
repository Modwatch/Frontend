(() => {
  "use strict";

  angular.module("modwatch.api")

  .factory("APIService", APIService);

  APIService.$inject = ["$http"];

  function APIService($http) {

    let api = "http://modwatchapi-ansballard.rhcloud.com";
    //api = "http://127.0.0.1:3001"; // local debug

    let apiService = {

      getFile: (username, filename) => {
        return $http.get(api + "/api/user/" + username + "/file/" + filename);
      },
      getProfile: (username) => {
        return $http.get(api + "/api/user/" + username + "/profile");
      },
      getFileNames: (username) => {
        return $http.get(api + "/api/user/" + username + "/files");
      },
      setTag: (username, tag) => {
        return $http.post(api + "/api/newTag/" + username, {
          "tag": tag
        });
      },
      setENB: (username, enb) => {
        return $http.post(api + "/api/newENB/" + username, {
          "enb": enb
        });
      },
      getUsers: (success, error) => {
        return $http.get(api + "/api/users/list");
      },
      searchModlists: (query) => {
        return $http.get(api + "/api/search/file/modlist/" + query);
      },
      searchPlugins: (query) => {
        return $http.get(api + "/api/search/file/plugins/" + query);
      },
      signIn: (username, password) => {
        return $http.post(api + "/auth/signin", {
          "username": username,
          "password": password
        });
      },
      checkToken: (token) => {
        return $http.post(api + "/auth/checkToken", {
          "token": token
        });
      },
      upvote: (votee, token) => {
        return $http.post(api + "/auth/upvote/" + votee, {
          "token": token
        });
      },
      downvote: (votee, token) => {
        return $http.post(api + "/auth/downvote/" + votee, {
          "token": token
        });
      }
    };

    return apiService;
  }

})();
