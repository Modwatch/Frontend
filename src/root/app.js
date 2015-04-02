var express = require('express');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var favicon = require('serve-favicon');
  var methodOverride = require('method-override');
  var session = require('express-session');
var app = express();

var http = require('http');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
//app.use(cookieParser());
//app.use(session({secret: process.env.DBEXPRESSSECRET, resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes.min.js') (app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
