const micro = require("micro");
const routes = require("./index.js");

micro(routes).listen(3000);
