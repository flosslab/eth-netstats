var express = require('express');
var _ = require('lodash');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var config;
try {
	config = require('../config');
}
catch (e)
{
	if( e.code === 'MODULE_NOT_FOUND')
	{
		console.log("WARNING: No config.js file found. use default config.js found at lib/utils/config.js...");
	}
	else
	{
		throw e;
		process.exit(1);
	}

	try {
		config = require('./utils/config');
	}
	catch (e)
	{
		throw e;
		process.exit(1);
	}
}

// default settings
var settings = {
	googleFontFamily: "Source Sans Pro",
	fontFamily: "Source Sans Pro"
};

// merge settings
_.extend(settings, config.settings);

// view engine setup
app.set('views', path.join(__dirname, (process.env.LITE === 'true' ? '../src-lite/views' : '../src/views')));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, (process.env.LITE === 'true' ? '../dist-lite' : '../dist'))));

app.get('/', function(req, res) {
	res.render('index', { title: config.title, settings });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});

// production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;