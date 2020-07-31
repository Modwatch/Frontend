import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, readFileSync } from "fs";
import { promisify } from "util";
import glob from "tiny-glob";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import postcssNesting from "postcss-nesting";
import postcssCustomProperties from "postcss-custom-properties";
import postcssURL from "postcss-url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "rollup-plugin-re";
import OMT from "@surma/rollup-plugin-off-main-thread";
import visualizer from "rollup-plugin-visualizer";

/* wild crazy mdx hacky shit */
import mdx from "@mdx-js/mdx";
import rollupEsbuild from "rollup-plugin-esbuild";
import esbuild from "esbuild";
import { createFilter } from "@rollup/pluginutils";

const readFileAsync = promisify(readFile);

const env = {
  API_ENV: process.env.API_ENV,
  NODE_ENV: process.env.NODE_ENV || "production",
  NOMODULE: (process.env.NOMODULE || "false") === "true",
  ADSENSE_ENABLED: (process.env.ADSENSE_ENABLED || "false") === "true",
  NOPOSTS: (process.env.NOPOSTS || "false") === "true",
  ADSENSE_CLIENT: "ca-pub-8579998974655014"
};

const localPkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default async () => {
  const posts = !env.NOPOSTS ? await glob("src/router/posts/*.mdx") : [];
  const postNames = posts.map(p => basename(p, ".mdx"));
  return {
    input: "src/index.tsx",
    output: {
      sourcemap: env.NODE_ENV !== "production" ? "inline" : true,
      exports: "named",
      dir: resolve(
        dirname(fileURLToPath(import.meta.url)),
        `public/dist/${env.NOMODULE ? "no" : ""}module/`
      ),
      format: process.env.NODE_ENV === "production" ? "amd" : "es"
    },
    context: null,
    moduleContext: null,
    treeshake: env.NODE_ENV === "production",
    preserveEntrySignatures: false,
    preserveSymlinks: true,
    watch: {
      clearScreen: false
    },
    external: postNames.map(p => `./${p}.js`),
    plugins: [
      postcss({
        include: ["./src/*.css", "./src/**/*.css", "./node_modules/@modwatch/core/**/*.css"],
        sourceMap: env.NODE_ENV === "production",
        modules: {
          scopeBehaviour: "global"
        },
        extract: true,
        plugins: [
          postcssNesting(),
          postcssCustomProperties({
            importFrom: "node_modules/@modwatch/core/src/properties.css",
            preserve: false
          }),
          postcssURL({
            url: "inline"
          })
        ].concat(env.NODE_ENV !== "production" ? [] : [cssnano()])
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', ".ts", ".tsx", ".mdx"]
      }),
      commonjs({
        include: ["node_modules/**"],
        sourceMap: env.NODE_ENV === "production"
      }),
      replace({
        include: ["./src/*/*.ts+(|x)", "./src/**/*.ts+(|x)", "./node_modules/@modwatch/core/**/*.ts+(|x)"],
        replaces: {
          "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
          "process.env.VERSION": JSON.stringify(localPkg.version),
          "process.env.NOMODULE": env.NOMODULE ? "true" : "false",
          "process.env.ADSENSE_ENABLED": env.ADSENSE_ENABLED ? "true" : "false",
          "process.env.ADSENSE_CLIENT": JSON.stringify(env.ADSENSE_CLIENT),
          "process.env.NOPOSTS": JSON.stringify(!!env.NOPOSTS),
          "process.env.API_URL":
            env.API_ENV === "production" || (!env.API_ENV && env.NODE_ENV === "production")
              ? JSON.stringify("https://api.modwat.ch")
              : JSON.stringify("http://localhost:3001"),
          "process.env.LAZY_POST_INITIALIZERS": postNames.map(p => `/* LAZY IMPORTS INJECTED VIA ROLLUP */\nconst ${p[0].toUpperCase()}${p.slice(1)} = lazy(() => import("./posts/${p}.mdx"));`).join("\n"),
          "{/*ROUTER_POST_SUSPENDERS*/}": postNames.map(p => (`/* SUSPENDED POST ROUTES INJECTED VIA ROLLUP */\n
  <Suspense path="/post/${p}" fallback={<div>loading ${p}</div>}>
  <${p[0].toUpperCase()}${p.slice(1)} {...props} />
  </Suspense>
          `)).join("\n")
        },
        patterns: (env.NODE_ENV !== "production" ? [{
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
      mdxPlugin({
        include: ["./src/**/*.mdx"],
        exclude: "node_modules/**"
      }),
      rollupEsbuild({
        include: ["./src/*/*.ts+(|x)", "./src/**/*.ts+(|x)", "./node_modules/@modwatch/core/**/*.ts+(|x)"],
        exclude: [],
        watch: process.argv.includes("--watch"),
        target: env.NOMODULE ? "es2015" : "es2016",
        jsxFactory: "h",
        jsxFragment: "Fragment"
      })
    ].concat(
      env.NODE_ENV === "production"
        ? [
          OMT({
            loader: (await readFileAsync(
              resolve("./node_modules/@modwatch/core/loadz0r/loader.min.js"),
              "utf8"
            )).replace(/process\.env\.PUBLIC_PATH/g, JSON.stringify(`/dist/${env.NOMODULE ? "no" : ""}module`)),
            prependLoader: (chunk, workerFiles) =>
              (chunk.isEntry && chunk.fileName.includes("index.js")) || workerFiles.includes(chunk.facadeModuleId)
          }),
            visualizer({
              filename: `./node_modules/.visualizer/index-${
                env.NOMODULE ? "no" : ""
              }module.html`,
              title: `Modwatch Dependency Graph (${
                env.NOMODULE ? "no" : ""
              }module)`,
              bundlesRelative: true,
              template: "treemap"
            })
          ]
        : []
    )
  };
}

function mdxPlugin(options) {
  if (!options) options = {};
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "preact-mdx-esbuild",
    transform: async (code, id) => {
      if (!filter(id)) return null;

      const jsx = `import { h } from "preact"; import { mdx } from "@mdx-js/preact";\n${(await mdx(code))}`;

      const es5 = await esbuild.transform(jsx, {
        loader: "jsx",
        watch: process.argv.includes("--watch"),
        target: env.NOMODULE ? "es2015" : "es2016",
        jsxFactory: "mdx"
      });

      try {
        return {
          code: es5.js
        };
      } catch (e) {
        e.plugin = "preact-mdx-esbuild";
        if (!e.loc) e.loc = {};
        e.loc.file = id;
        e.frame = e.snippet;
        throw e;
      }
    }
  };
}
