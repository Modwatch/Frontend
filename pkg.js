/*eslint-env node*/
const micro = require("micro");
const getPort = require("get-port");
const opn = require("opn");
const keypress = require("keypress");
let routes = require("./index.js");
const { _ } = require("minimist")(process.argv.slice(2));

getPort({ port: _[0] || 6693 })
  .then(port => routes.then(r => ({ server: micro(r).listen(port), port })))
  .then(({ server, port }) => {
    opn(`http://local.modwat.ch${port === 80 ? "" : `:${port}`}`);
    keypress(process.stdin);
    console.log(
      `Modwatch Uploader is running at http://local.modwat.ch${
        port === "80" ? "" : `:${port}`
      }`
    );
    console.log("To stop the server, press 'Q'");
    process.stdin.on("keypress", (ch, key) => {
      if (key) {
        if (key.name === "q" || (key.ctrl && key.name === "c")) {
          console.log("Modwatch Uploader is shutting down...");
          server.close(() => {
            console.log("Done! You can close this window now.");
            process.exit(0);
          });
        } else if (key.name === "r") {
          if (key.ctrl) {
            delete require.cache[require.resolve("./index.js")];
            routes = require("./index.js");
          }
          console.log("Restarting the Modwatch Uploader...");
          server.close(() => {
            server.listen(port, () => {
              console.log("Modwatch Uploader is restarted!");
            });
          });
        }
      }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
  });
