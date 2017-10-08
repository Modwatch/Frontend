const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

module.exports = webpackEnv => {
  const env = Object.assign({}, process.env, webpackEnv);
  return {
    entry: "./src/vue/index.jsx",
    output: {
      path: path.resolve(__dirname, "public/dist/"),
      publicPath: "/dist/",
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "es6-promise": path.join(
          __dirname,
          "node_modules",
          "es6-promise",
          "es6-promise.js"
        ),
        fetch: path.join(
          __dirname,
          "node_modules",
          "unfetch",
          "dist",
          "unfetch.js"
        )
      }
		]
	},
	plugins: [
    new ExtractTextPlugin("styles.css"),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.MODWATCH_API_URL": process.env.NODE_ENV !== "production" ?
        JSON.stringify("http://localhost:3001") :
        JSON.stringify("https://api.modwat.ch")
    })
	].concat(process.env.NODE_ENV === "production" ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};
