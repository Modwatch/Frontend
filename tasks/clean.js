(function() {
  "use strict";

  var gulp = require("gulp");
  var del = require("del");

  var config = require("../gulpconfig");

  gulp.task("cleanJS", () => {
    return del([config.dist.js, config.dist.js + ".map"]);
  });

  gulp.task("cleanNode", () => {
    return del(config.dist.node + "*.js");
  });

  gulp.task("cleanTemplate", () => {
    return del([config.dist.template + "*.js"]);
  });

  gulp.task("cleanCSS", () => {
    return del([config.dist.css]);
  });

})();
