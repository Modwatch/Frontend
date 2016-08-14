"use strict";

import { watch } from "graceful-fs";
import denodeify from "denodeify";
import { writeFile } from "fs";
import { dirname } from "path";
import { server } from "superstatic";
import { red } from "chalk";

import javascript from "./javascript";
import css from "./css";

const writeFileAsync = denodeify(writeFile);

let watcher = {
  close() {}
};

export function run(program = {}) {

  const processes = [];

  if(program.watch) {
    if(program.serve) {
      server({
        config: {
          public: "./public"
        },
        cwd: process.cwd(),
        host: "0.0.0.0",
        port: "8080",
        debug: false
      }).listen(err => {
        if(err) {
          console.log(err);
        }
      });
    }
    program.onquit(() => {
      watcher.close();
    });
  }

  if(program.all || program.javascript) {
    processes.push(javascript({
      entry: "src/js/entry.js",
      minify: program.minify,
      out: "public/dist/bundle.js"
    })
    .catch(e => {
      console.log(e);
      if(program.deploy) {
        throw e;
      }
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "Javascript",
          build: javascript
        }));
      }
      return opts;
    }));
  }

  if(program.all || program.serviceworkers) {
    processes.push(javascript({
      entry: "src/serviceworkers/cache.sw.js",
      minify: program.minify,
      out: "./public/sw.js"
    })
    .catch(e => {
      console.log(e);
      if(program.deploy) {
        throw e;
      }
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "Service Workers",
          build: javascript
        }));
      }
      return opts;
    }));
  }

  if(program.all || program.css) {
    processes.push(css({
      entry: "src/css/entry.css",
      minify: program.minify,
      out: "public/dist/styles.css"
    })
    .catch(e => {
      console.log(e);
      if(program.deploy) {
        throw e;
      }
    })
    .then(opts => {
      if(program.watch) {
        watchFileType(Object.assign({}, opts, {
          prettyName: "CSS",
          build: css
        }));
      }
      return opts;
    }));
  }

  return Promise.all(processes);

  function watchFileType(opts = {}) {
    watcher = watch(opts.strictWatch || dirname(opts.entry), {
      persistent: true,
      recursive: true
    }, (event, filename) => {
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
