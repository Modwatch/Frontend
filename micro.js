"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { router, get, post, del } = require("microrouter");
const { send } = require("micro");
const Cors = require("micro-cors");
const compress = require("micro-compress");
const { encode } = require("jwt-simple");
const mocks = require("./src/__helpers__/mocks");
const cors = Cors();
async function throttledSend(res, status, response) {
    return new Promise(resolve => {
        setTimeout(() => resolve(send(res, status, response)), Math.random() * 50 + 175);
    });
}
exports.default = cors(compress(router(
/* User */
get("/api/user/:username/file/:filetype", async (req, res) => {
    await throttledSend(res, 200, mocks[req.params.filetype]);
}), get("/api/user/:username/profile", async (req, res) => {
    await throttledSend(res, 200, mocks.profile);
}), get("/api/user/:username/files", async (req, res) => {
    await throttledSend(res, 200, mocks.files);
}), get("/api/user/:username/all", async (req, res) => {
    await throttledSend(res, 200, mocks.all);
}), post("/api/user/:username/delete", async (req, res) => {
    await throttledSend(res, 200);
}), post("/api/user/:username/changepass", async (req, res) => {
    await throttledSend(res, 200);
}), 
/* Users */
get("/api/users/count", async (req, res) => {
    await throttledSend(res, 200, mocks.users.length);
}), get("/api/users/list(/:limit)", async (req, res) => {
    await throttledSend(res, 200, mocks.users);
}), get("/api/search/users/:query/:limit", async (req, res) => {
    const query = req.params.query.toLowerCase();
    await throttledSend(res, 200, mocks.users.filter(user => user.username.toLowerCase().includes(query)));
}), 
/* OAuth */
get("/oauth/authorize", (req, res) => {
    res.statusCode = 301;
    res.setHeader("Location", `${decodeURIComponent(req.query.redirect_uri)}oauth/access_token/${encodeURIComponent(encode(mocks.token, "FAKE_JWT_SECRET"))}/token_type/Bearer/expires_in/3600`);
    res.end();
}), get("/oauth/verify", async (req, res) => {
    await throttledSend(res, 200);
}), del("/oauth/user/:username/delete", async (req, res) => {
    await throttledSend(res, 200);
}))));
