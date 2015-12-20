import userlistTemplate from "../routes/userlist/userlist.template.html";
import profileTemplate from "../routes/profile/profile.template.html";
import homeTemplate from "../routes/home/home.template.html";

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
    .when("/userlist", {
      template: userlistTemplate,
      controller: "UserlistController",
      controllerAs: "vm",
      bindToController: true
    })
    .otherwise({
      redirectTo: "/"
    });

  locationProvider.html5Mode(true);
}
