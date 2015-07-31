var gulp = require("gulp");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var fs = require("fs");
var ngAnnotate = require("gulp-ng-annotate");
var minifyCSS = require("gulp-minify-css");
var inject = require("gulp-inject");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("buildNode", function() {
  "use strict";
  return gulp.src("src/root/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"))
  ;
});

gulp.task("buildNG", function() {
  "use strict";
  return gulp.src(["src/angular/app.js", "src/angular/*.js"])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat("ng.min.js"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./public/angular/"))
  ;
});

gulp.task("buildCSS", function() {
  "use strict";
  return gulp.src("src/css/*.css")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(concat("local.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./public/css/"))
  ;
});

gulp.task("injectNG", ["buildNG"], function() {
  "use strict";
  return gulp.src("views/home.html")
    .pipe(plumber())
    .pipe(inject(gulp.src("public/angular/ng.min.js", {read: false}), {
      transform: function(filepath) {
        var fp = filepath.split("/");
        return "<script type=\"text/javascript\" src=\"/angular/" + fp[fp.length - 1] + "\"></script>";
      }
    }))
    .pipe(gulp.dest("views/"))
  ;
});

gulp.task("injectCSS", ["buildCSS"], function() {
  "use strict";
  return gulp.src("views/home.html")
    .pipe(plumber())
    .pipe(inject(gulp.src("public/css/local.min.css", {read: false}), {
      transform: function(filepath) {
        var fp = filepath.split("/");
        return "<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/" + fp[fp.length - 1] + "\"/>";
      }
    }))
    .pipe(gulp.dest("views/"))
  ;
});

gulp.task("injectTemplates", function() {
  "use strict";
  return gulp.src("views/home.html")
    .pipe(plumber())
    .pipe(inject(gulp.src("src/templates/*.html", {read: false}), {
      transform: function(filepath) {
        var fp = filepath.split("/");
        var contents = fs.readFileSync("src/templates/" + fp[fp.length - 1], "utf8");
        return "<script type=\"text/ng-template\" id=\"" + fp[fp.length - 1] + "\">" + contents + "</script>";
      }
    }))
    .pipe(gulp.dest("views/"))
  ;
});

gulp.task("copyFonts", function() {
  "use strict";
  return gulp.src("src/fonts/*.*")
    .pipe(plumber())
    .pipe(gulp.dest("public/fonts/"))
  ;
});

gulp.task("copyImages", function() {
  "use strict";
  return gulp.src("src/images/*.*")
    .pipe(plumber())
    .pipe(gulp.dest("public/images/"))
  ;
});

gulp.task("copy", ["copyFonts", "copyImages", "injectTemplates"]);
gulp.task("default", ["copy", "buildNode", "injectCSS", "injectNG"]);
