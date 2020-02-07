import { ServerRequest, ServerResponse } from "microrouter";

import { router, get, post, del } from "microrouter";
import { send } from "micro";
import Cors from "micro-cors";
import compress from "micro-compress";
import { encode } from "jwt-simple";

import * as mocks from "./src/__helpers__/mocks";
import Post from './src/components/post';

const cors = Cors();

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
  url: string;
  response?: any | RouteDefResponseFunction;
}

const routes: RouteDef[] = [{
  method: get,
  url: "/api/user/:username/file/:filetype",
  response: params => mocks[params.filetype]
}, {
  method: get,
  url: "/api/user/:username/profile",
  response: mocks.profile
}, {
  method: get,
  url: "/api/user/:username/files",
  response: mocks.files
}, {
  method: get,
  url: "/api/user/:username/all",
  response: mocks.all
}, {
  method: post,
  url: "/api/user/:username/delete"
}, {
  method: post,
  url: "/api/user/:username/changepass"
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

export default cors(compress(router(
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
  del("/oauth/user/:username/delete", async (req: ServerRequest, res: ServerResponse) => {
    await throttledSend(res, 200);
  })
)));
