(() => {
  "use strict";

  angular.module("modwatch.profileview")

    .filter("checked", () => {
      return (input, toggle) => {
        if (!toggle) {
          return input;
        } else {
          let filtered = [];
          for (let i = 0; i < input.length; i++) {
            if (input[i].display.indexOf("-") !== 0) {
              filtered.push(input[i]);
            }
          }
          return filtered;
        }
      };
    })
    .filter("capitalize", () => {
      return (input) => {
        return input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
      };
    })
    .filter("modwatchLimitTo", () => {
      return (input, limit) => {
        return (input && input.length > limit) ? (input.substr(0, limit) + "...") : input;
      };
    })
  ;

})();
