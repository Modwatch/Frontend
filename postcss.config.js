const cssnext = require("postcss-cssnext");
const imp = require("postcss-import");
const cssnano = require("cssnano");
const nesting = require("postcss-nesting"); // temp fix

module.exports = {
  plugins: [
    imp(),
    cssnext({
      features: {
        autoprefixer: process.env.NODE_ENV !== "production"
      }
    }),
    nesting() // temp fix
  ].concat(process.env.NODE_ENV === "production" ? [cssnano()] : [])
};
