module.exports = function(grunt) { "use strict";

  var transformInjected = function transformInjected(path, index, length) {
    if(length > 0 && path !== undefined) {
      if(path.indexOf(".css") > 0) {
        return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + path.replace("/public/", "/") + "\"/>";
      } else {
        return "<script type=\"text/javascript\" src=\"" + path.replace("/public/", "/") + "\"></script>";
      }
    } else {
      return "";
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      node: {
        options: {
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n",
          sourceMap: true
        },
        files: [
          {
            expand: true,
            cwd: "src/root/",
            src: ["*.js"],
            dest: "./",
            ext: ".min.js"
          }
        ]
      },
      angular: {
        options: {
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n",
          sourceMap: true
        },
        files: [
          {
            src: "tmp/angular/annotated.ng.js",
            dest: "public/angular/ng.js"
          }
        ]
      },
      bower: {
        options: {
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n",
          sourceMap: true
        },
        files: [
          {
            src: "tmp/bower/js/all.bower.js",
            dest: "public/bower/js/all.bower.js"
          }
        ]
      }
    },
    cssmin: {
      local: {
        files: {
          "public/css/all.css": "src/css/*.css"
        }
      },
      bower: {
        files: {
          "public/bower/css/all.bower.css": "tmp/bower/css/all.bower.css"
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: {
          "public/images/FNV_NEXUS_small.png": "src/images/FNV_NEXUS_small.png",
          "public/images/congruent_outline.png": "src/images/congruent_outline.png",
          "public/images/GitHub-Logo_invert.png": "src/images/GitHub-Logo_invert.png",
          "public/images/ajax-loader.gif": "src/images/ajax-loader.gif"
        }
      }
    },
    ngAnnotate: {
      options: {
        remove: true,
        add: true
      },
      dist: {
        files: {
          "tmp/angular/annotated.ng.js": ["src/angular/app.js", "src/angular/*.js"]
        }
      }
    },
    clean: {
      tmp: ["tmp"],
      angular: ["tmp/angular"],
      bower: ["tmp/bower"]
    },
    bower_concat: {
      all: {
        dest: "tmp/bower/js/all.bower.js",
        cssDest: "tmp/bower/css/all.bower.css",
        mainFiles: {
          "angular-ui-bootstrap": ["dist/ui-bootstrap-custom-tpls-0.12.1.min.js"]
        }
      }
    },
    injector: {
      local: {
        files: {
          "views/home.html": [
            "public/angular/ng.js",
            "public/css/all.css"
          ]
        },
        options: {
          transform: transformInjected
        }
      },
      bowerJS: {
        files: {
          "views/home.html": [
            "public/bower/js/all.bower.js"
          ]
        },
        options: {
          transform: transformInjected,
          starttag: "<!-- injector:bowerjs -->",
          endtag: "<!-- endinjector -->"
        }
      },
      bowerCSS: {
        files: {
          "views/home.html": [
            "public/bower/css/all.bower.css"
          ]
        },
        options: {
          transform: transformInjected,
          starttag: "<!-- injector:bowercss -->",
          endtag: "<!-- endinjector -->"
        }
      }
    },
    cacheBust: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: "16",
        deleteOriginals: false,
        rename: false,
        baseDir: "public/"
      },
      dist: {
        files: [{
          src: "views/home.html"
        }]
      }
    },
    concurrent: {
      inject: ["injector:local", "injector:bowerJS", "injector:bowerCSS"],
      minify: ["cssmin:local", "cssmin:bower", "imagemin:dist", "ngMin", "uglify:node", "uglify:bower"],
      serve: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ["watch", "nodemon:dev"]
      },
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ["watch", "nodemon:dev", "karma:angular"]
      }
    },
    nodemon: {
      dev: {
        script: "app.min.js"
      }
    },
    eslint: {
      target: ["src/**/*.js"]
    },
    karma: {
      angular: {
        configFile: "karma.conf.js",
        autoWatch: true
      }
    },
    watch: {
      css: {
        files: ["src/css/*.css"],
        tasks: ["cssmin:local"]
      },
      backend: {
        files: ["src/root/*.js"],
        tasks: ["eslint", "uglify:node"]
      },
      angular: {
        files: ["src/angular/*.js"],
        tasks: ["eslint", "ngMin"]
      },
      bower: {
        files: ["bower.json"],
        tasks: ["buildBower"]
      }
    }
  });

  require("jit-grunt")(grunt);

  grunt.registerTask("default", ["clean:tmp", "eslint", "bower_concat", "concurrent:minify", "concurrent:inject", "cacheBust:dist", "clean:tmp"]);
  grunt.registerTask("serve", ["default", "concurrent:serve"]);
  grunt.registerTask("dev", ["default", "concurrent:dev"]);
  grunt.registerTask("ngMin", ["ngAnnotate:dist", "uglify:angular", "clean:angular"]);
  grunt.registerTask("buildBower", ["clean:bower", "bower_concat", "uglify:bower", "cssmin:bower", "injector:bowerJS", "injector:bowerCSS"]);
  grunt.registerTask("buildNotBower", ["clean:tmp", "ngMin", "cssmin:local", "uglify:node", "imagemin:dist", "injector:local", "cacheBust:dist"]);
};
