import userlistTemplate from "../routes/userlist/userlist.template.html";
import profileTemplate from "../routes/profile/profile.template.html";
import homeTemplate from "../routes/home/home.template.html";
import settingsTemplate from "../routes/settings/settings.template.html";

export default RouteConfig;

function RouteConfig(routeProvider, locationProvider) {
  routeProvider
  .when("/", {
    template: homeTemplate
  })
  .when("/u/:username", {
    template: profileTemplate,
    controller: "ProfileController",
    controllerAs: "vm",
    bindToController: true
  })
  .when("/settings", {
    template: settingsTemplate,
    controller: "SettingsController",
    controllerAs: "vm",
    bindToController: true,
    resolve: {
      authRoute
    }
  })
  .when("/userlist", {
    template: userlistTemplate,
    controller: "UserlistController",
    controllerAs: "vm",
    bindToController: true
  })
  .otherwise({
    redirectTo: "/"
  });

  authRoute.$inject = ["$location", "APIService", "localStorageService"];
  function authRoute($location, APIService, localStorageService) {
    return APIService.checkToken(localStorageService.get("token"))
    .catch(e => {
      $location.path("/");
    });
  }

  locationProvider.html5Mode(true);
}
