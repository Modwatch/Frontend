(function() {
  "use strict";

  var gulp = require("gulp");
  var plumber = require("gulp-plumber");
  var templateCache = require("gulp-angular-templatecache");

  var config = require("../gulpconfig");

  gulp.task("cacheTemplates", function() {
    return gulp.src(config.src.template)
      .pipe(plumber())
      .pipe(templateCache({
        module: config.dist.module,
        transformUrl: function(url) {
          if(url.indexOf("/") !== -1) {
            return url.split("/")[url.split("/").length - 1];
          } else if(url.indexOf("\\") !== -1) {
            return url.split("\\")[url.split("\\").length - 1];
          } else {
            return url;
          }
        }
      }))
      .pipe(gulp.dest(config.dist.template))
    ;
  });

})();
