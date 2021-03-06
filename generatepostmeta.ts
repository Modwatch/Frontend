const { watch, readFile, writeFile } = require("fs");
const { basename } = require("path");
const { promisify } = require("util");
const { red, yellow, cyan, green } = require("colorette");
const glob = require("tiny-glob");
const mri = require("mri");
const mdx = require("@mdx-js/mdx");
const esbuild = require("esbuild");
const requireFromString = require("require-from-string");

const argv = mri(process.argv.slice(2), {
  boolean: ["watch"],
  string: [],
  alias: {
    watch: "w"
  },
  default: {}
});
const [readFileAsync, writeFileAsync] = [readFile, writeFile].map(promisify);

if (watch && !["win32", "darwin"].some(os => process.platform.indexOf(os))) {
  console.log(
    yellow(
      `postgen.js -> Your OS (${process.platform}) does not support fs.watch`
    )
  );
  process.exit(1);
}

(async () => {
  if (argv.watch) {
    console.log(cyan("postgen.js -> watching..."));
    generatePostsFile({ watch: false });
    let debounceTimeout = undefined;
    watch(
      "src/router/posts",
      {
        recursive: true
      },
      (event, filename) => {
        if (filename !== "posts.ts") {
          debounceTimeout && clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            generatePostsFile({ watch });
            debounceTimeout = undefined;
          }, 50);
        }
      }
    );
  } else {
    generatePostsFile({ watch });
  }
})();

const decoder = new TextDecoder("utf-8");

async function generatePostsFile({ watch }) {
  try {
    const filenames = (await glob(`src/router/posts/**/*.mdx`, {
      filesOnly: true,
      absolute: true
    })).sort((a, b) => (basename(a) < basename(b) ? -1 : 1));
    const contents = await Promise.all(
      filenames.map(async file => await readFileAsync(file, "utf8"))
    );

    const posts = await Promise.all(contents.map(async (content, index) => {
      const jsx = await mdx(content);
      const parsed = await esbuild.build({
        platform: "node",
        write: false,
        bundle: true,
        stdin: {
          contents: jsx,
          sourcefile: filenames[index],
          loader: "jsx",
        },
      });
      const cjs = decoder.decode(
        parsed.outputFiles[0].contents
      );
      return {
        ...requireFromString(cjs).metadata,
        id: basename(filenames[index], ".mdx")
      };
    }));

    await writeFileAsync(
      "src/store/posts.ts",
      `/* generated by /postgen.js */\nexport const metadata = ${JSON.stringify(
        posts,
        null,
        2
      )};\n`
    );
    console.log(
      green(
        `postgen.js -> Generated src/store/posts.ts (${filenames.length} post${
          posts.length > 1 ? "s" : ""
        })`
      )
    );
  } catch (e) {
    console.error(red(e));
    console.log(
      red(
        `postgen.js -> Failed to grab a list of posts in via src/router/posts/**/*.mdx and create a new all.tsx file importing metadata from each`
      )
    );
    !watch && process.exit(1);
  }
}
