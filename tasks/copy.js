(function() {
  "use strict";

  var gulp = require("gulp");
  var plumber = require("gulp-plumber");

  var config = require("../gulpconfig");

  gulp.task("copyFonts", function() {
    return gulp.src(config.src.fonts)
      .pipe(plumber())
      .pipe(gulp.dest(config.dist.fonts))
    ;
  });

  gulp.task("copyImages", function() {
    return gulp.src(config.src.images)
      .pipe(plumber())
      .pipe(gulp.dest(config.dist.images))
    ;
  });

  gulp.task("copy", ["copyFonts", "copyImages"]);

})();
