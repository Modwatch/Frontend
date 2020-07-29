import { ServerRequest, ServerResponse } from "microrouter";

import { router, get, post, del } from "microrouter";
import { send } from "micro";
import Cors from "micro-cors";
import { encode } from "jwt-simple";
import UrlPattern from "url-pattern";

import * as mocks from "./src/__helpers__/mocks";

const cors = Cors();
const usernameRegex = {
  segmentValueCharset: "a-zA-Z0-9-_~ %@!\\.'\\(\\)\\[\\]"
}

async function throttledSend(res: ServerResponse, status: number, response?: any) {
  return new Promise(resolve => {
    setTimeout(() => resolve(send(res, status, response)), Math.random() * 50 + 175);
  });
}

interface RouteDefResponseFunction {
  (params: any): any;
}
type RouteDef = {
  method: get | post;
  url: string | UrlPattern;
  response?: any | RouteDefResponseFunction;
}

const routes: RouteDef[] = [{
  method: get,
  url: new UrlPattern("/api/user/:username/file/:filetype", usernameRegex),
  response: params => mocks[params.filetype]
}, {
  method: get,
  url: new UrlPattern("/api/user/:username/profile", usernameRegex),
  response: mocks.profile
}, {
  method: get,
  url: new UrlPattern("/api/user/:username/files", usernameRegex),
  response: mocks.files
}, {
  method: get,
  url: new UrlPattern("/api/user/:username/all", usernameRegex),
  response: mocks.all
}, {
  method: post,
  url: new UrlPattern("/api/user/:username/delete", usernameRegex)
}, {
  method: post,
  url: new UrlPattern("/api/user/:username/changepass", usernameRegex)
}, {
  method: get,
  url: "/api/users/count",
  response: mocks.users.length
}, {
  method: get,
  url: "/api/users/list(/:limit)",
  response: mocks.users
}, {
  method: get,
  url: "/api/search/users/:query/:limit",
  response: params => mocks.users.filter(user => user.username.toLowerCase().includes(params.query.toLowerCase()))
}]

export default cors(router(
  /* User */
  ...routes.map(route => route.method(route.url, async (req: ServerRequest, res: ServerResponse) => {
    await throttledSend(res, 200, typeof route.response === "function" ? route.response(req.params) : route.response);
  })),
  /* OAuth */
  get("/oauth/authorize", (req: ServerRequest, res: ServerResponse) => {
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
  }),
  get("/oauth/verify", async (req: ServerRequest, res: ServerResponse) => {
    await throttledSend(res, 200);
  }),
  get("*", async (req, res) => {
    await throttledSend(res, 404);
  }),
  del("/oauth/user/:username/delete", async (req: ServerRequest, res: ServerResponse) => {
    await throttledSend(res, 200);
  })
));
