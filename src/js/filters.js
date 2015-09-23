(function() { "use strict";

    angular.module("modwatchApp")

    .filter("checked", function() {
      return function(input, toggle) {
        if(!toggle) {
          return input;
        } else {
          var filtered = [];
          for(var i = 0; i < input.length; i++) {
            if(input[i].display.indexOf("-") !== 0) {
              filtered.push(input[i]);
            }
          }
          return filtered;
        }
      };
    })
    .filter("capitalize", function() {
      return function(input) {
        return input ? input[0].toUpperCase() + input.substr(1).toLowerCase() : input;
      };
    })
    .filter("modwatchLimitTo", function() {
      return function(input, limit) {
        return (input && input.length > limit) ? (input.substr(0, limit) + "...") : input;
      };
    });

}());
