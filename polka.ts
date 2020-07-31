import polka from "polka";
import { encode } from "jwt-simple";
import Cors from "cors";

import * as mocks from "./src/__helpers__/mocks";

const app = polka();
const cors = Cors({ origin:true });

app.use(cors);

interface RouteDefResponseFunction {
  (params: any): any;
}
type RouteDef = {
  method: "get" | "post";
  url: string;
  response?: any | RouteDefResponseFunction;
}

const routes: RouteDef[] = [{
  method: "get",
  url: "/api/user/:username/file/:filetype",
  response: params => JSON.stringify(mocks[params.filetype])
}, {
  method: "get",
  url: "/api/user/:username/profile",
  response: JSON.stringify(mocks.profile)
}, {
  method: "get",
  url: "/api/user/:username/files",
  response: JSON.stringify(mocks.files)
}, {
  method: "get",
  url: "/api/user/:username/all",
  response: JSON.stringify(mocks.all)
}, {
  method: "post",
  url: "/api/user/:username/delete"
}, {
  method: "post",
  url: "/api/user/:username/changepass"
}, {
  method: "get",
  url: "/api/users/count",
  response: JSON.stringify(mocks.users.length)
}, {
  method: "get",
  url: "/api/users/list/:limit?",
  response: JSON.stringify(mocks.users)
}, {
  method: "get",
  url: "/api/search/users/:query/:limit",
  response: params => JSON.stringify(mocks.users.filter(user => user.username.toLowerCase().includes(params.query.toLowerCase())))
}];

routes.forEach(({ method, url, response }) => {
  app[method](url, (req, res) => {
    res.end(typeof response === "function" ? response(req.params) : response)
  })
});

app.get("/oauth/authorize", (req, res) => {
  res.statusCode = 301;
  res.setHeader(
    "Location",
    `${decodeURIComponent(
      req.query.redirect_uri
    )}oauth/access_token/${encodeURIComponent(
      encode(mocks.token, "FAKE_JWT_SECRET")
    )}/token_type/Bearer/expires_in/3600`
  );
  res.end();
});
app.get("/oauth/verify", async (req, res) => {
  res.statusCode = 200;
  res.end();
});
app.get("*", async (req, res) => {
  res.statusCode = 404;
  res.end();
});
app.delete("/oauth/user/:username/delete", async (req, res) => {
  res.statusCode = 200;
  res.end();
});

app.listen(3001, err => {
  if(err) throw err;
  console.log("Local API running at http://localhost:3001...");
});
