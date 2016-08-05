"use strict";

import "core-js/es6/promise";
import { writeFile } from "fs";
import { red } from "chalk";
import denodeify from "denodeify";
import { rollup } from "rollup";
import uglifyjs from "uglify-js";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import rollupJSON from "rollup-plugin-json";
import rollupString from "rollup-plugin-string";
import babel from "rollup-plugin-babel";

const writeFileAsync = denodeify(writeFile);

export default function javascript(opts = {}) {
  return rollup({
    entry: opts.entry,
    plugins: [
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs(),
      rollupString({
        include: "**/*.html"
      }),
      rollupJSON(),
      babel({
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["es2015-rollup"]
      })
    ]
  })
  .then(bundle => bundle.generate({
    format: "cjs",
    sourceMap: false
  }))
  .then(obj => opts.minify ? uglifyjs.minify(obj.code, {
    inSourceMap: opts.sourcemap ? JSON.parse(obj.map) : undefined,
    outSourceMap: opts.sourcemap ? `${opts.out}.map` : undefined,
    fromString: true,
    mangle: true
  }) : obj)
  .then(obj => Promise.all([
    writeFileAsync(opts.out, obj.code),
    opts.sourcemap ? writeFileAsync(`${opts.out}map`, obj.map) : Promise.resolve()
  ]))
  .catch(e => {
    console.log(`\nJavascript Error: ${red(e.message)}`);
  })
  .then(() => opts);
}
