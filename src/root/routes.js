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
	app.get("/test", function(req, res) {
		res.sendFile("test.html", {root: "views/"}, function(err) {
			if(err) {
				res.sendStatus(500);
			}
		});
	});

};
