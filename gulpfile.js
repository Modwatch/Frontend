(function() {
  "use strict";


  var gulp = require("gulp");
  var babel = require("gulp-babel");
  var uglify = require("gulp-uglify");
  var plumber = require("gulp-plumber");
  var concat = require("gulp-concat");
  var rename = require("gulp-rename");
  var fs = require("fs");
  var ngAnnotate = require("gulp-ng-annotate");
  var minifyCSS = require("gulp-minify-css");
  var inject = require("gulp-inject");
  var sourcemaps = require("gulp-sourcemaps");

  var config = require("./gulpconfig");

  var requireDir = require("require-dir");

  requireDir("./tasks");

  gulp.task("default", ["inject", "buildNode", "copy"]);

  gulp.task("watch", ["default"], function() {

    gulp.watch(config.src.js, ["injectJS"]);
    gulp.watch(config.src.template, ["cacheTemplates"]);
    gulp.watch(config.src.node, ["buildNode"]);
    gulp.watch(config.src.css, ["injectCSS"]);
  });

  module.exports = function() {
    gulp.run("default");
  };

})();
