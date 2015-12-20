(() => {
  "use strict";

  const express = require("express");
  const bodyParser = require("body-parser");
  const methodOverride = require("method-override");
  const app = express();

  const http = require("http");
  const path = require("path");

  const ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
  const port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

  app.set("port", port);
  app.set("ip", ipaddress);
  app.set("views", path.join(__dirname, "server", "views"));
  app.set("view engine", "html");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(methodOverride());
  app.use(express.static("public"));

  require("./routes.js")(app);

  http.createServer(app).listen(app.get("port"), app.get("ip"), () => {
    console.log("Express server listening on port " + app.get("port"));
  });

})();
