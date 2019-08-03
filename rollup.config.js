import path from "path";
import { readFile } from "fs";
import { promisify } from "util";
import glob from "tiny-glob";
import { terser } from "rollup-plugin-terser";
import postcssPresetEnv from "postcss-preset-env";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import replace from "rollup-plugin-replace";
import loadz0r from "rollup-plugin-loadz0r";
import visualizer from "rollup-plugin-visualizer";

/* wild crazy mdx hacky shit */
import mdx from "@mdx-js/mdx";
import buble from "buble";
import { createFilter } from "rollup-pluginutils";

const localPkg = require("./package.json");

const env = {
  API_ENV: process.env.API_ENV,
  NODE_ENV: process.env.NODE_ENV || "production",
  NOMODULE: (process.env.NOMODULE || "false") === "true" // default to the es6, "type=module" version
};

const readFileAsync = promisify(readFile);

export default async () => ({
  input: ["src/index.tsx"].concat(await glob("src/router/posts/*.mdx")),
  output: {
    sourceMap: env.NODE_ENV === "production",
    exports: "named",
    dir: path.resolve(__dirname, `public/dist/${env.NOMODULE ? "no" : ""}module/`),
    format: "amd"
  },
  treeshake: env.NODE_ENV === "production",
  experimentalOptimizeChunks: env.NODE_ENV === "production",
  watch: {
    clearScreen: false
  },
  plugins: [
    nodeResolve(),
    commonjs({
      sourceMap: env.NODE_ENV === "production"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.VERSION": JSON.stringify(localPkg.version),
      "process.env.NOMODULE": env.NOMODULE ? "true" : "false",
      "process.env.API_URL": env.API_ENV === "production" || env.NODE_ENV === "production"
          ? JSON.stringify("https://api.modwat.ch")
           : JSON.stringify(
        "http://localhost:3001"
      ),
      "import \"preact/debug\";": "",
      ...(env.NOMODULE ? {} : {
        "import \"unfetch/polyfill/index\";": ""
      })
    }),
    mdxPlugin({
      include: ["./src/*/*.mdx", "./src/**/*.mdx"],
      exclude: "node_modules/**"
    }),
    typescript({
      include: ["./src/*/*.ts+(|x)", "./src/**/*.ts+(|x)"],
      exclude: "node_modules/**",
      typescript: require("typescript"),
      tslib: require("tslib"),
      sourceMap: env.NODE_ENV === "production",
      isolatedModules: env.NODE_ENV === "production",
      target: env.NOMODULE ? "es5" : "es6"
    }),
    postcss({
      include: ["./src/*.css", "./src/**/*.css"],
      exclude: "node_modules/**",
      sourceMap: env.NODE_ENV === "production",
      modules: {
        scopeBehaviour: "global"
      },
      extract: true,
      plugins: [
        postcssPresetEnv({
          stage: false,
          features: {
            "nesting-rules": true,
            "custom-properties": {
              importFrom: "./src/properties.css",
              preserve: false
            }
          }
        })
      ].concat(env.NODE_ENV === "production" ? [cssnano()] : [])
    }),
    loadz0r({
      loader: await readFileAsync(path.resolve(__dirname, "loader.ejs"), "utf8"),
      publicPath: `/dist/${env.NOMODULE ? "no" : ""}module`
    })
  ].concat(
    env.NODE_ENV === "production"
      ? [
          terser(),
          visualizer({
            filename: `./node_modules/.visualizer/index-${env.NOMODULE ? "no" : ""}module.html`,
            title: `Modwatch Dependency Graph (${env.NOMODULE ? "no" : ""}module)`
          })
        ]
      : []
  )
});

function mdxPlugin(options) {
  if (!options) options = {};
  var filter = createFilter(options.include, options.exclude);

  return {
    name: "preact-mdx-buble",
    transform: async function(code, id) {
      if (!filter(id)) return null;

      const jsx = `import { h } from "preact";\n${(await mdx(code)).replace(
        "/* @jsx mdx */",
        ""
      )}`;

      const es5 = buble.transform(jsx, {
        transforms: { modules: false },
        jsx: "h",
        objectAssign: "Object.assign"
      });

      try {
        return es5;
      } catch (e) {
        e.plugin = "preact-mdx-buble";
        if (!e.loc) e.loc = {};
        e.loc.file = id;
        e.frame = e.snippet;
        throw e;
      }
    }
  };
}
