import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import npm from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import optimizejs from "optimize-js";
import gzip from "gzip-size";
import bytes from "bytes";

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
    optimize(),
    size()
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

function size() {
  return {
    transformBundle(code) {
      console.log(`
bundle.js
=========
SIZE: ${bytes(code.length)}
GZIP: ${bytes(gzip.sync(code))}
`
      );
      return { code };
    }
  }
}
