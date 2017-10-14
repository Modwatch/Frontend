/*eslint-env node*/
const { send } = require("micro");
const { router, get } = require("microrouter");
const opn = require("opn");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { _ } = require("minimist")(process.argv.slice(2));

const distMap = {};
const dist = [
  "bundle.js",
  "home.bundle.js",
  "main.bundle.js",
  "modlist.bundle.js",
  "oauth.bundle.js",
  "styles.css"
].forEach(f => {
  distMap[f] = readFileSync(resolve(__dirname, "public", "dist", f), "utf8");
});
const image = [
  "congruent_outline.png",
  "modwatch_144.png",
  "modwatch_192.png",
  "modwatch_256.png",
  "modwatch_512.png"
].forEach(f => {
  distMap[f] = readFileSync(resolve(__dirname, "public", "images", f));
});
const fontmap = ["eot", "svg", "ttf", "woff", "woff2"].forEach(f => {
  distMap[f] = readFileSync(
    resolve(__dirname, "public", "fonts", `glyphicons-halflings-regular.${f}`),
    "utf8"
  );
});
const index = readFileSync(resolve(__dirname, "public", "index.html"), "utf8");

module.exports = router(
  get("/dist/*", (req, res) => {
    res.setHeader(
      "Content-Type",
      req.params._.includes("js") ? "application/javascript" : "text/css"
    );
    const f = distMap[req.params._];
    return send(res, f ? 200 : 404, f);
  }),
  get("/images/:filename.png", (req, res) => {
    res.setHeader("Content-Type", "image/png");
    const f = distMap[`${req.params.filename}.png`];
    return send(res, f ? 200 : 404, f);
  }),
  get("*", (req, res) => send(res, 200, index))
);

opn(`http://local.modwat.ch${_.length > 0 ? `:${_[0]}` : ""}`);
