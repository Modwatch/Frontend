(() => {
  "use strict";

  let express = require("express");
  let bodyParser = require("body-parser");
  let methodOverride = require("method-override");
  let app = express();

  let http = require("http");
  let path = require("path");

  let ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
  let port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

  app.set("port", port);
  app.set("ip", ipaddress);
  app.set("views", path.join(__dirname, "server", "views"));
  app.set("view engine", "html");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(methodOverride());
  app.use(express.static(path.join(__dirname, "public")));

  require("./routes.min.js")(app);

  http.createServer(app).listen(app.get("port"), app.get("ip"), () => {
    console.log("Express server listening on port " + app.get("port"));
  });

})();
