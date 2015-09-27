(function() {
  "use strict";

  var gulp = require("gulp");
  var plumber = require("gulp-plumber");
  var babel = require("gulp-babel");
  var ngAnnotate = require("gulp-ng-annotate");
  var uglify = require("gulp-uglify");
  var sourcemaps = require("gulp-sourcemaps");
  var cssmin = require("gulp-minify-css");
  var concat = require("gulp-concat");

  var config = require("../gulpconfig");

  gulp.task("buildJS", ["cleanJS", "cacheTemplates"], function() {
    return gulp.src(config.src.js)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(concat("script.min.js"))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(config.dist.main))
    ;
  });

  gulp.task("buildNode", ["cleanNode"], function() {
    return gulp.src(config.src.node)
      .pipe(plumber())
      .pipe(babel())
      .pipe(uglify())
      .pipe(gulp.dest(config.dist.node))
    ;
  });

  gulp.task("buildCSS", ["cleanCSS"], function() {
    return gulp.src(config.src.css)
      .pipe(plumber())
      .pipe(cssmin())
      .pipe(concat("style.min.css"))
      .pipe(gulp.dest(config.dist.main))
    ;
  });

  gulp.task("build", ["buildJS", "buildCSS", "buildNode"]);

})();
