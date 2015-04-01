module.exports = function(app, passport, scriptVersion) {

	app.get('/', function(req, res) {
		res.sendfile('views/home.html');
	});
	app.get('/users', function(req, res) {
		res.render('allusers.ejs');
	});
	/*app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login'
	}));*/
	app.get('/:username', function(req, res) {

		Modlist.findOne({username: req.params.username},{username:1}, function(err, _list) {
			if(!_list) {
				res.redirect('/');
			}
			else {
				/*if(_list.list && _list.list.length > 0) {
					_list.UpdateOldStyleModlist();
				}*/
				res.render('profile.ejs', {
					username: _list.username,
					owner: (req.user != undefined && req.user.username == req.params.username) ? true : false
				});
			}
		});
	});

	app.post('/usersearch', function(req, res) {
		res.redirect('/'+req.body.username);
	});
	app.post('/:username/newpass', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {
			if(_modlist) {
				if(_modlist.validPassword(req.body.oldPassword)) {
					_modlist.password = _modlist.generateHash(req.body.newPassword);
					_modlist.save(function(err) {
						if(err) {
							console.log(err);
						} else {
							// nope
						}
					});
					res.statusCode = 200;
					res.write("Password changed");
					res.end();
				} else {
					res.statusCode = 403;
					res.write("Access denied, incorrect password");
					res.end();
				}
			} else {
				res.statusCode = 400;
				res.write("No username found");
				res.end();
			}
		});
	});
};

var Blog = require('./public/models/blog.min.js');
var Modlist = require('./public/models/modlist.min.js');
function isLoggedIn(req, res, next) {

	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.writeHead(403);
		res.end();
	}
}
