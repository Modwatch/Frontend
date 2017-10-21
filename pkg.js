/*eslint-env node*/
const micro = require("micro");
const getPort = require("get-port");
const opn = require("opn");
const routes = require("./index.js");
const { _ } = require("minimist")(process.argv.slice(2));

getPort({port: _[0] || 80})
.then(port => {
  micro(routes).listen(port);
  opn(`http://local.modwat.ch${port === 80 ? "" : `:${port}`}`)
});
