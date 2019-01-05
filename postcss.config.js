const presetEnv = require("postcss-preset-env");
const imp = require("postcss-import");
const cssnano = require("cssnano");

module.exports = {
  plugins: [
    imp(),
    presetEnv()
  ].concat(process.env.NODE_ENV === "production" ? [cssnano()] : [])
};
