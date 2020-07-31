// import { ServerRequest, ServerResponse } from "microrouter";

// import { router, get, post, del } from "microrouter";
// import { send } from "micro";
// import Cors from "micro-cors";
import { encode } from "jwt-simple";
import polka from "polka";
// import UrlPattern from "url-pattern";

import * as mocks from "./src/__helpers__/mocks";

// const cors = Cors();
// const usernameRegex = {
//   segmentValueCharset: "a-zA-Z0-9-_~ %@!\\.'\\(\\)\\[\\]"
// }

// async function throttledSend(res: ServerResponse, status: number, response?: any) {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(send(res, status, response)), Math.random() * 50 + 175);
//   });
// }

const app = polka();

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
  response: params => mocks[params.filetype]
}, {
  method: "get",
  url: "/api/user/:username/profile",
  response: mocks.profile
}, {
  method: "get",
  url: "/api/user/:username/files",
  response: mocks.files
}, {
  method: "get",
  url: "/api/user/:username/all",
  response: mocks.all
}, {
  method: "post",
  url: "/api/user/:username/delete"
}, {
  method: "post",
  url: "/api/user/:username/changepass"
}, {
  method: "get",
  url: "/api/users/count",
  response: mocks.users.length
}, {
  method: "get",
  url: "/api/users/list(/:limit)",
  response: mocks.users
}, {
  method: "get",
  url: "/api/search/users/:query/:limit",
  response: params => mocks.users.filter(user => user.username.toLowerCase().includes(params.query.toLowerCase()))
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
  console.log("localhost:3001");
});