
/**
 * Module dependencies.
 */

var express = require('express')
	, debug = require('debug')('http')
	, requests = require('request')
  , routes = require('./routes');

var app = module.exports = express.createServer(); // pass key and cert for https

// Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/twinderella');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var User = new Schema({
		user  :  {type:String, index: { unique: true } }
  , auth  :  {type:String, index: { unique: true } }
  , uid   :  {type:String, index: { unique: true } }
	});

var UserModel = mongoose.model('User', User);

// Configuration

app.configure(function(){

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// functions

var usertrain = function(req, res){
	var userd = req.body.user;
	var authd = req.body.auth;
	var uidd = userd + "@facebook.com";
	var namespaced = "facebook.com";

	console.log("user: " + userd + " has tried to authorize with " + authd + " for space :" + uidd);

	var instance = new UserModel();
	instance.user = userd;
	instance.auth = authd;
	instance.uid = uidd;
	instance.save(function (err) {
  	console.log(err);
	});

};

// Routes

app.post('/', routes.index);
app.post('/users', usertrain);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
