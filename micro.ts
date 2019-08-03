import { ServerRequest, ServerResponse } from "microrouter";

const { router, get, post, del } = require("microrouter");
const { send } = require("micro");
const Cors = require("micro-cors");
const compress = require("micro-compress");
const { encode } = require("jwt-simple");

const mocks = require("./src/__helpers__/mocks");

const cors = Cors();

export default cors(compress(router(
  /* User */
  get("/api/user/:username/file/:filetype", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks[req.params.filetype]);
  }),
  get("/api/user/:username/profile", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.profile);
  }),
  get("/api/user/:username/files", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.files);
  }),
  get("/api/user/:username/all", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.all);
  }),
  post("/api/user/:username/delete", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200);
  }),
  post("/api/user/:username/changepass", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200);
  }),
  /* Users */
  get("/api/users/count", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.users.length);
  }),
  get("/api/users/list(/:limit)", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.users);
  }),
  get("/api/search/users/:query/:limit", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, mocks.users.filter(user => user.username.includes(req.params.query)));
  }),
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
  get("/oauth/verify", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200);
  }),
  del("/oauth/user/:username/delete", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200);
  })
)));
