(function() {
  "use strict";

  //var argv = require("yargs").argv;

  var distFolder = "./dist/";
  var srcFolder = {
    "main": "./src/",
    "js": "./src/js/",
    "css": "./src/css/",
    "node": "./src/node/",
    "fonts": "./src/fonts/",
    "images": "./src/images/"
  };

  var dist = {
    "main": distFolder,
    "js": distFolder + "script.min.js",
    "template": "./tmp/templates/",
    "css": distFolder + "style.min.css",
    "node": "./server/",
    "fonts": distFolder + "images/",
    "images": distFolder + "fonts/",
    "inject": "./server/home.html",
    "module": "modwatchApp"
  };

  var src = {
    "js": [
      srcFolder.js + "*.module.js",
      srcFolder.js + "**/*.module.js",
      srcFolder.js + "*.js",
      srcFolder.js + "**/*.js",
      dist.template + "*.js"
    ],
    "template": [
      srcFolder.js + "*.template.html",
      srcFolder.js + "**/*.template.html"
    ],
    "css": [
      srcFolder.css + "*.css",
      srcFolder.css + "**/*.css"
    ],
    "node": [
      srcFolder.node + "*.js"
    ],
    "fonts": [
      srcFolder.fonts + "*.*"
    ],
    "images": [
      srcFolder.images + "*.*"
    ]
  };

  module.exports = {
    dist: dist,
    src: src,
    srcFolder: srcFolder
  };

})();
