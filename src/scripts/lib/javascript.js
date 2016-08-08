"use strict";

import "core-js/es6/promise";
import { writeFile } from "fs";
import denodeify from "denodeify";
import { red } from "chalk";
import { minify } from "uglify-js";
import browserify from "browserify";
import babelify from "babelify";
import uglifyify from "uglifyify";
import partialify from "partialify";
import es2015 from "babel-preset-es2015";

const writeFileAsync = denodeify(writeFile);

export default function javascript(opts = {}) {
  return new Promise((resolve, reject) => {
    browserify(opts.entry)
    .transform("babelify", {presets: ["es2015"]})
    .transform("partialify")
    .transform({compress: true, mangle: true}, "uglifyify")
    .bundle((err, buf) => {
      if(err) {
        reject(err);
      } else {
        resolve(opts.minify ? minify(buf.toString(), {compress: true, mangle: true, fromString: true}).code : buf.toString())
      }
    })
  })
  .then(code => {
    return writeFileAsync(opts.out, code, "utf8");
  })
  .catch(e => {
    console.log(`\nJavascript Error: ${red(e.message)}`);
  })
  .then(() => opts);
}
