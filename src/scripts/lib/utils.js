"use strict";

import { watch } from "chokidar";
import denodeify from "denodeify";
import { writeFile } from "fs";
import { dirname } from "path";

import javascript from "../lib/javascript.rollup";
import css from "../lib/css";

const writeFileAsync = denodeify(writeFile);

let watcher = {
  close() {}
};

export function run(program = {}) {
  if(program.watch) {
    program.onquit(() => {
      watcher.close();
    });
  }

  if(program.all || program.javascript) {
    javascript({
      entry: "src/js/entry.js",
      minify: program.minify,
      out: "public/dist/bundle.js"
    })
    .catch(e => {
      console.log(e);
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "Javascript",
          build: javascript
        }));
      }
    });
  }

  if(program.all || program.serviceworkers) {
    javascript({
      entry: "src/serviceworkers/cache.sw.js",
      minify: program.minify,
      out: "./public/sw.js"
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "Service Workers",
          build: javascript
        }));
      }
    });
  }

  if(program.all || program.css) {
    css({
      entry: "src/css/entry.css",
      minify: program.minify,
      out: "public/dist/styles.css"
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "CSS",
          build: css
        }));
      }
    });
  }

  function watchFileType(opts = {}) {
    watcher = watch(opts.strictWatch || dirname(opts.entry), {
      persistent: true
    })
    .on("all", (event, filename) => {
      program.building && program.building(opts);
      opts.build(opts)
      .then(() => {
        program.goodWatch && program.goodWatch(opts);
      })
      .catch(e => {
        program.badWatch && program.badWatch(e, opts);
      });
    });
  }
}
