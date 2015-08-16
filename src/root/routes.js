var request = require("request");

module.exports = function(app) { "use strict";

	app.get("/", function(req, res) {
		res.sendFile("home.html", {root: "views/"}, function(err) {
			if(err) {
				res.sendStatus(500);
			}
		});
	});
	app.get("/u/:username", function(req, res) {
		res.redirect("/#/u/" + req.params.username);
	});
	app.get("/userlist", function(req, res) {
		res.redirect("/#userlist");
	});
	app.get("/test", function(req, res) {
		res.sendFile("test.html", {root: "views/"}, function(err) {
			if(err) {
				res.sendStatus(500);
			}
		});
	});
	app.post("/fullloadorder", function(req, res) {
		request.post("http://modwatchapi-ansballard.rhcloud.com/fullloadorder", {form: req.body}, function(err, proxyRes, body) {
			if(err) {
				res.setStatus = 500;
				res.end();
			} else {
				res.statusCode = 200;
				res.end();
			}
		});
	});

};
