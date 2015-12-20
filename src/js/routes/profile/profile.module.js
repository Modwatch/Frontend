import ProfileController from "./profile.controller";
import Capitalize from "./filters/capitalize.filter";
import Checked from "./filters/checked.filter";
import ModwatchLimitTo from "./filters/modwatchLimitTo.filter";

angular.module("modwatch.profile", [])
  .controller("ProfileController", ProfileController)
  .filter("capitalize", Capitalize)
  .filter("checked", Checked)
  .filter("modwatchLimitTo", ModwatchLimitTo);
