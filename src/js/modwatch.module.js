import AppConfig from "./config/appConfig";

import "angular";
import "angular-route";
import "angular-animate";

import "angular-local-storage";
import "./libs/ui-bootstrap-custom-tpls-0.14.3.min.js";

import "./services/api/api.module";
import "./modals/modals.module";

import "./routes/wrapper/wrapper.module";
import "./routes/userlist/userlist.module";
import "./routes/profile/profile.module";
import "./routes/home/home.module";

angular.module("modwatch", [
  /** 1st Party **/
  "ngRoute",
  "ngAnimate",
  /** 3rd Party **/
  "LocalStorageModule",
  "ui.bootstrap",
  /** Services **/
  "modwatch.api",
  "modwatch.modals",
  /** Routes **/
  "modwatch.wrapper",
  "modwatch.home",
  "modwatch.userlist",
  "modwatch.profile"
])
.config(AppConfig);
