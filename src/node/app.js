import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import http from "http";
import { join } from "path";

import routes from "./routes";
const app = express();

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
const port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.set("port", port);
app.set("ip", ipaddress);
app.set("views", join(__dirname, "server", "views"));
app.set("view engine", "html");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride());
app.use(express.static("public"));

routes(app);

http.createServer(app).listen(app.get("port"), app.get("ip"), () => {
  console.log(`Express server listening on port ${app.get("port")}`);
});
