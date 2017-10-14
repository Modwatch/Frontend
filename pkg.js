/*eslint-env node*/
const micro = require("micro");
const routes = require("./index.js");
const { _ } = require("minimist")(process.argv.slice(2));

micro(routes).listen(_[0] || 80);
