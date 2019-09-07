import path from "path";
import { readFile } from "fs";
import { promisify } from "util";
import glob from "tiny-glob";
import postcss from "rollup-plugin-postcss";
import postcssNesting from "postcss-nesting";
import postcssCustomProperties from "postcss-custom-properties";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-re";
import OMT from "@surma/rollup-plugin-off-main-thread";

/* wild crazy mdx hacky shit */
import mdx from "@mdx-js/mdx";
import { transform } from "sucrase";
import sucrase from "rollup-plugin-sucrase";
import { createFilter } from "rollup-pluginutils";

const localPkg = require("./package.json");

const readFileAsync = promisify(readFile);

const env = {
  API_ENV: process.env.API_ENV,
  NODE_ENV: process.env.NODE_ENV || "production",
  NOMODULE: (process.env.NOMODULE || "false") === "true", // default to the es6, "type=module" version
  ADSENSE_CLIENT: "ca-pub-8579998974655014"
};

export default async () => ({
  input: ["src/index.tsx"].concat(await glob("src/router/posts/*.mdx")),
  output: {
    sourcemap: env.NODE_ENV !== "production" ? "inline" : true,
    exports: "named",
    dir: path.resolve(
      __dirname,
      `public/dist/${env.NOMODULE ? "no" : ""}module/`
    ),
    format: "amd"
  },
  treeshake: env.NODE_ENV === "production",
  experimentalOptimizeChunks: env.NODE_ENV === "production",
  watch: {
    clearScreen: false
  },
  plugins: [
    nodeResolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', ".ts", ".tsx", ".mdx"]
    }),
    replace({
      replaces: {
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
        "process.env.VERSION": JSON.stringify(localPkg.version),
        "process.env.NOMODULE": env.NOMODULE ? "true" : "false",
        "process.env.ADSENSE_CLIENT": JSON.stringify(env.ADSENSE_CLIENT),
        "process.env.API_URL":
          env.API_ENV === "production" || env.NODE_ENV === "production"
            ? JSON.stringify("https://api.modwat.ch")
            : JSON.stringify("http://localhost:3001")
      },
      patterns: (env.NODE_ENV !== "production" ? [/*{
        test: /(import .+ from \"\@modwatch\/types\";)/,
        replace: "// $1 // removed at build time"
      }, {
        test: /(import .+ from \"\..+\/types\";)/,
        replace: "// $1 // removed at build time"
      }, */{
        test: /(.*)\s*\/\/\/PROD_ONLY/g,
        replace: "// $1 // removed at build time"
      }] : [{
        test: /(.*)\s*\/\/\/DEV_ONLY/g,
        replace: "// $1 // removed at build time"
      }]).concat(env.NOMODULE ? [] : [{
        test: /(.*)\s*\/\/\/NOMODULE_ONLY/g,
        replace: "// $1 // removed at build time"
      }])
    }),
    commonjs({
      sourceMap: env.NODE_ENV === "production"
    }),
    mdxPlugin({
      include: ["./src/**/*.mdx"],
      exclude: "node_modules/**"
    }),
    env.NODE_ENV !== "production" ?
      sucrase({
        include: ["./src/*/*.ts+(|x)", "./src/**/*.ts+(|x)"],
        exclude: "node_modules/**",
        transforms: [
          "jsx",
          "typescript"
        ],
        jsxPragma: "h"
      }) : require("rollup-plugin-typescript")({
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
        postcssNesting(),
        postcssCustomProperties({
          importFrom: "./src/properties.css",
          preserve: false
        })
      ].concat(env.NODE_ENV !== "production" ? [] : [require("cssnano")()])
    }),
    OMT({
      loader: (await readFileAsync(
        path.resolve(__dirname, "loadz0r", "loader.min.js"),
        "utf8"
      )).replace(/process\.env\.PUBLIC_PATH/g, JSON.stringify(`/dist/${env.NOMODULE ? "no" : ""}module`)),
      prependLoader: (chunk, workerFiles) =>
        (chunk.isEntry && chunk.fileName.includes("index.js")) || workerFiles.includes(chunk.facadeModuleId)
    })
  ].concat(
    env.NODE_ENV === "production"
      ? [
          require("rollup-plugin-terser").terser({
            ecma: env.NOMODULE ? 5 : 6,
            compress: true,
            mangle: true,
            toplevel: true,
            sourcemap: true
          }),
          require("rollup-plugin-visualizer")({
            filename: `./node_modules/.visualizer/index-${
              env.NOMODULE ? "no" : ""
            }module.html`,
            title: `Modwatch Dependency Graph (${
              env.NOMODULE ? "no" : ""
            }module)`
          })
        ]
      : []
  )
});

function mdxPlugin(options) {
  if (!options) options = {};
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "preact-mdx-sucrase",
    transform: async (code, id) => {
      if (!filter(id)) return null;

      const jsx = `import { h } from "preact";\n${(await mdx(code)).replace(
        "/* @jsx mdx */",
        ""
      )}`;

      const es5 = await transform(jsx, {
        transforms: [
          "jsx",
          "typescript"//,
          // "imports"
        ],
        jsxPragma: "h"
      });

      try {
        return es5;
      } catch (e) {
        e.plugin = "preact-mdx-sucrase";
        if (!e.loc) e.loc = {};
        e.loc.file = id;
        e.frame = e.snippet;
        throw e;
      }
    }
  };
}
