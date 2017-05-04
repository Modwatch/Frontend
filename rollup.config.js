import babel from "rollup-plugin-babel";
// import alias from "rollup-plugin-alias";
import replace from "rollup-plugin-replace";
// import commonjs from "rollup-plugin-commonjs";
import npm from "rollup-plugin-node-resolve";
// import json from "rollup-plugin-json";
// import string from "rollup-plugin-string";
import uglify from "rollup-plugin-uglify";
import optimizejs from "optimize-js";

export default {
  entry: "src/vue/index.jsx",
  dest: "public/dist/bundle.js",
  sourceMap: process.env.NODE_ENV !== "production" ? true : undefined,
  sourceMapFile: process.env.NODE_ENV !== "production" ? "public/dist/bundle.js.map" : undefined,
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    npm({
      browser: true
    }),
    babel({
      exclude: "node_modules/**"
    })
  ].concat(process.env.NODE_ENV === "production" ? [
    uglify({
      compress: true,
      mangle: true
    }),
    optimize()
  ] : []),
  format: "iife"
};

function optimize() {
  return {
    transformBundle(code) {
      return {
        code: optimizejs(code)
      };
    }
  };
}
