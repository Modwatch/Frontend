export default TokenConfig;

function TokenConfig(localStorageServiceProvider, httpProvider) {
  localStorageServiceProvider.setPrefix("modwatch");
  httpProvider.interceptors.push(TokenInterceptor);
}

TokenInterceptor.$inject = ["$q", "$window", "$location", "localStorageService"];

function TokenInterceptor($q, $window, $location, localStorageService) {
  return {
    "request": (config) => {
      config.headers = config.headers || {};
      if (localStorageService.get("token")) {
        config.headers.Authorization = "Bearer " + localStorageService.get("token");
      }
      return config;
    },
    "responseError": (response) => {
      if(response.status === 401 || response.status === 403) {
        //$window.console("signin");
      }
      return $q.reject(response);
    }
  };
}
