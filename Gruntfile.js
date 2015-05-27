module.exports = function(grunt) {

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
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"
        },
        files: [
          {
            src: "tmp/angular/annotated.ng.js",
            dest: "public/angular/ng.js"
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          "public/css/all.css": "src/css/*.css"
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
      angular: ["tmp/angular"]
    },
    wiredep: {
      dist: {
        options: {
          ignorePath: "\.\./public"
        },
        src: [
          "views/home.html"
        ]
      }
    },
    injector: {
      dist: {
        files: {
          "views/home.html": ["public/angular/ng.js", "public/css/all.css"]
        },
        options: {
          transform: function(path, index, length) {
            if(length > 0 && path !== undefined) {
              if(path.indexOf(".css") > 0) {
                return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + path.replace("/public/", "/") + "\"/>";
              } else {
                return "<script type=\"text/javascript\" src=\"" + path.replace("/public/", "/") + "\"></script>";
              }
            } else {
              return "";
            }
          }
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
      inject: ["wiredep:dist", "injector:dist"],
      minify: ["cssmin:dist", "imagemin:dist", "ngMin", "uglify:node"],
      serve: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ["watch", "nodemon:dev"]
      }
    },
    nodemon: {
      dev: {
        script: "app.min.js"
      }
    },
    watch: {
      css: {
        files: ["src/css/*.css"],
        tasks: ["cssmin:dist"]
      },
      backend: {
        files: ["src/root/*.js"],
        tasks: ["uglify:node"]
      },
      angular: {
        files: ["src/angular/*.js"],
        tasks: ["ngMin"]
      }
    }
  });

  require('jit-grunt')(grunt);

  grunt.registerTask("default", ["clean:tmp", "concurrent:minify", "concurrent:inject", "cacheBust:dist", "clean:tmp"]);
  grunt.registerTask("serve", ["concurrent:serve"]);
  grunt.registerTask("ngMin", ["ngAnnotate:dist", "uglify:angular", "clean:angular"])
};
