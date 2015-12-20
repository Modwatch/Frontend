import RouteConfig from "./routeConfig";
import TokenConfig from "./tokenConfig";

AppConfig.$inject = ["localStorageServiceProvider", "$routeProvider", "$locationProvider", "$httpProvider"];

export default AppConfig;

function AppConfig(localStorageServiceProvider, $routeProvider, $locationProvider, $httpProvider) {

  RouteConfig($routeProvider, $locationProvider);
  TokenConfig(localStorageServiceProvider, $httpProvider);

}
