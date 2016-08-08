(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "modwatch",
  "version": "0.3.0",
  "private": true,
  "scripts": {
    "start": "http-server ./public",
    "cli": "node scripts/cli.js",
    "build:cli": "browserify --no-bundle-external --node ./src/scripts/interfaces/cli.js -t [babelify --presets es2015] -o ./scripts/cli.js",
    "prepublish": "npm run build:cli && npm run cli -- -am"
  },
  "main": "server.js",
  "dependencies": {
    "@ansballard/paginate": "^1.1.4",
    "angular": "^1.5.8",
    "angular-animate": "^1.5.8",
    "angular-local-storage": "^0.2.2",
    "angular-route": "^1.5.8",
    "bootstrap": "^3.3.7"
  },
  "devDependencies": {
    "babel-cli": "^6.3.17",
    "babel-eslint": "^6.1.2",
    "babel-preset-es2015": "^6.5.0",
    "babelify": "^7.3.0",
    "browserify": "^13.1.0",
    "chokidar": "^1.5.1",
    "core-js": "^2.3.0",
    "cssnano": "^3.5.2",
    "denodeify": "^1.2.1",
    "glob": "^7.0.0",
    "html-minifier": "^1.2.0",
    "http-server": "^0.9.0",
    "keypress": "^0.2.1",
    "marked": "^0.3.5",
    "mkdirp": "^0.5.1",
    "ora": "^0.2.1",
    "partialify": "^3.1.6",
    "postcss": "^5.0.17",
    "postcss-cli": "^2.5.1",
    "postcss-cssnext": "^2.4.0",
    "postcss-import": "^8.0.2",
    "uglify-js": "^2.6.2",
    "uncss": "^0.13.0"
  },
  "subdomain": "skyrimmodwatcher",
  "domains": [
    "modwat.ch",
    "www.modwat.ch"
  ],
  "engines": {
    "node": "^0.10.0"
  }
}

},{}],2:[function(require,module,exports){
"use strict";

var _package = require("../../package.json");

var version = "v" + _package.version + "::";

self.addEventListener("install", function (event) {
	event.waitUntil(caches.open(version + "ansballard").then(function (cache) {
		return cache.addAll(["/", "/images/congruent_outline.png", "/dist/bundle.js", "/dist/styles.css"]);
	}));
});

self.addEventListener("fetch", function (event) {
	if (event.request.method !== "GET") {
		return;
	}
	event.respondWith(caches.match(event.request).then(function (cached) {
		return cached || fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);

		function fetchedFromNetwork(response) {
			var cacheCopy = response.clone();
			caches.open(version + "pages").then(function (cache) {
				cache.put(event.request, cacheCopy);
			});
			return response;
		}

		function unableToResolve() {
			return new Response("<h1>Service Unavailable</h1>", {
				status: 503,
				statusText: "Service Unavailable",
				headers: new Headers({
					"Content-Type": "text/html"
				})
			});
		}
	}));
});

self.addEventListener("activate", function (event) {
	event.waitUntil(caches.keys().then(function (keys) {
		return Promise.all(keys.filter(function (key) {
			return !key.startsWith(version);
		}).map(function (key) {
			return caches.delete(key);
		}));
	}));
});

},{"../../package.json":1}]},{},[2]);
