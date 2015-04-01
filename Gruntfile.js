module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      backend: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          sourceMap: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/root/',
            src: ['*.js'],
            dest: './',
            ext: '.min.js'
          }
        ]
      },
      angular: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [
          {
            src: 'tmp/angular/app.concat.js',
            dest: 'public/angular/app.min.js'
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: 'src/stylesheets/',
            src: ['*.css'],
            dest: 'public/stylesheets/',
            ext: '.min.css'
          }
        ]
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: {
          'public/images/FNV_NEXUS_small.png': 'src/images/FNV_NEXUS_small.png',
          'public/images/congruent_outline.png': 'src/images/congruent_outline.png',
          'public/images/GitHub-Logo_invert.png': 'src/images/GitHub-Logo_invert.png',
          'public/images/ajax-loader.gif': 'src/images/ajax-loader.gif'
        }
      }
    },
    ngAnnotate: {
      options: {
        remove: true,
        add: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/angular/',
            src: ['*.js'],
            dest: 'tmp/angular/',
            ext: '.annotated.js'
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      dist: {
        files: [
          {
            src: ['tmp/angular/app.annotated.js','tmp/angular/*.annotated.js'],
            dest: 'tmp/angular/app.concat.js'
          }
        ]
      }
    },
    clean: ['tmp'],
    watch: {
      css: {
        files: ['src/stylesheets/*.css'],
        tasks: ['cssmin']
      },
      backend: {
        files: ['src/root/*.js'],
        tasks: ['uglify:backend']
      },
      angular: {
        files: ['src/angular/*.js'],
        tasks: ['ngAnnotate','concat','uglify:angular','clean']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['ngAnnotate','concat','uglify:angular','clean','uglify:backend','cssmin']);
  grunt.registerTask('angularMin', ['ngAnnotate','concat','uglify:angular'])
};
