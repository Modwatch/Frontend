const Terser = require("terser");
const { readFile, writeFile } = require("fs");
const { promisify } = require("util");
const { resolve } = require("path");

const [readFileAsync, writeFileAsync] = [readFile, writeFile].map(promisify);

const mangledPrefix = `
var P=Promise,
D=document;
`.replace(/\n/g, "");

(async() => {
  const loader = await readFileAsync(resolve(__dirname, "loader.js"), "utf8");
  const loaderMin = Terser.minify(loader, {
    toplevel: true,
    mangle: true,
    compress: true
  }).code;
  const mangledLoaderMin = loaderMin
    .replace(/Promise/g, "P")
    .replace(/document\./g, "D.");
  const prefixedMangledLoaderMin = `{${mangledPrefix}${mangledLoaderMin}}`;
  await writeFileAsync(resolve(__dirname, "loader.min.js"), prefixedMangledLoaderMin, "utf8");
})();
