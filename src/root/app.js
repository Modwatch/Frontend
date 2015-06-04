var express = require("express");
  var bodyParser = require("body-parser");
  var methodOverride = require("method-override");
var app = express();

var http = require("http");
var path = require("path");

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.set("port", port);
app.set("ip", ipaddress);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));

require("./routes.min.js")(app);

http.createServer(app).listen(app.get("port"), function() { "use strict";
  console.log("Express server listening on port " + app.get("port"));
});
