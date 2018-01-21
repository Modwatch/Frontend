/*eslint-env node*/
const { send } = require("micro");
const { router, get, post } = require("microrouter");
const opn = require("opn");
const { readFile, readFileSync } = require("fs");
const { promisify } = require("util");
const { resolve, sep } = require("path");
const getPort = require("get-port");
const glob = require("glob");

const globAsync = promisify(glob);
const readFileAsync = promisify(readFile);

console.log("Initializing...");

module.exports = Promise.all([
  globAsync(resolve(__dirname, "public", "dist", "*")),
  globAsync(resolve(__dirname, "public", "images", "*")),
  globAsync(resolve(__dirname, "public", "fonts", "*")),
  globAsync(resolve(__dirname, "public", "index.html")),
  globAsync(resolve(__dirname, "public", "local.modwatch.webmanifest"))
])
  .then(globs =>
    Promise.all(
      globs.map(directory =>
        Promise.all(
          directory.map(file =>
            readFileAsync(file).then(contents => ({
              name: file.split(sep)[file.split(sep).length - 1],
              contents
            }))
          )
        )
      )
    )
  )
  .then(globs => ({
    dist: globs[0],
    images: globs[1],
    fonts: globs[2],
    index: globs[3][0],
    manifest: globs[4][0]
  }))
  .then(globs => (console.log("Assets Read..."), globs))
  .then(({ dist, images, fonts, index, manifest }) =>
    router(
      get("/dist/*", (req, res) => {
        res.setHeader(
          "Content-Type",
          req.params._.includes("js") ? "application/javascript" : "text/css"
        );
        const f = dist.find(d => d.name === req.params._) || {};
        return send(res, f && f.contents ? 200 : 404, f.contents.toString());
      }),
      get("/images/:filename.png", (req, res) => {
        res.setHeader("Content-Type", "image/png");
        const f =
          images.find(i => i.name === `${req.params.filename}.png`) || {};
        return send(res, f && f.contents ? 200 : 404, f.contents);
      }),
      get("/modwatch.webmanifest", (req, res) => {
        return send(res, 200, manifest.contents);
      }),
      get("*", (req, res) => {
        send(res, 200, index.contents.toString());
      })
    )
  )
  .then(routes => (console.log("Routes Initialized"), routes));
