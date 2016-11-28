  APIService.$inject = ["$http", "localStorageService"];

  export default APIService;

  function APIService($http, localStorageService) {

    const api = "https://modwatchapi-ansballard.rhcloud.com";
    // const api = "http://192.168.10.105:3001"; // local debug

    return {
      getFile(username, filename) {
        return $http.get(`${api}/api/user/${username}/file/${filename}`)
        .then(res => res.data || []);
      },
      getProfile(username) {
        return $http.get(`${api}/api/user/${username}/profile`)
        .then(res => res.data);
      },
      getFileNames(username) {
        return $http.get(`${api}/api/user/${username}/files`)
        .then(res => res.data || []);
      },
      setTag(username, tag) {
        return $http.post(`${api}/api/newTag/${username}`, {
          tag
        });
      },
      setENB(username, enb) {
        return $http.post(`${api}/api/newENB/${username}`, {
          enb
        });
      },
      getUsers(opts = {}) {
        if(opts.query) {
          return $http.get(`${api}/api/search/users/${opts.query}/${opts.limit || ""}`)
          .then(res => res.data)
          .then(data => data.map(profile => angular.extend({}, {
            game: "skyrim"
          }, profile)));
        } else {
          return $http.get(`${api}/api/users/list/${opts.limit || ""}`)
          .then(res => res.data || [])
          .then(data => data.map(profile => angular.extend({}, {
            game: "skyrim"
          }, profile)));
        }
      },
      searchModlists(query) {
        return $http.get(query ? `${api}/api/search/file/modlist/${query}` : `${api}/api/users/list`)
        .then(res => (query ? res.data.newUsers : res.data) || [])
        .then(data => data.map(profile => angular.extend({}, {
          game: "skyrim"
        }, profile)));
      },
      searchPlugins(query) {
        return $http.get(`${api}/api/search/file/plugins/${query}`)
        .then(res => res.data || [])
        .then(data => data.map(profile => angular.extend({}, {
          game: "skyrim"
        }, profile)));
      },
      signIn(username, password) {
        return $http.post(`${api}/auth/signin`, {
          username,
          password
        })
        .then(r => r.data.token);
      },
      checkToken(token) {
        return $http.post(`${api}/auth/checkToken`, {
          token
        })
        .then(res => res.data);
      },
      upvote(votee, token) {
        return $http.post(`${api}/auth/upvote/${votee}`, {
          token
        });
      },
      downvote(votee, token) {
        return $http.post(`${api}/auth/downvote/${votee}`, {
          token
        });
      },
      changepass(password) {
        return $http.post(`${api}/auth/changepass`, {
          password,
          token: localStorageService.get("token")
        });
      }
    };
  }
