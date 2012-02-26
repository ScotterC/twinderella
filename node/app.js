
/**
 * Module dependencies.
 */
//POSTEROUSID = "vsbpJJGisCGibogmzJCEAdcobHtIpGua"

//Nestful.put "http://posterous.com/api/2/sites/6863173/profile/image", {:format => :json, :params => { "file" => "http://twinderella.me/lib/img/cinderella.png", "api_token" => "vsbpJJGisCGibogmzJCEAdcobHtIpGua" } }



var express = require('express')
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

var indexfunc = function(req, res){
	console.log("Request hit index");
	var photo = req.body.photo;
	
	var api_key = "9c62b0d2526dee43a19e9a2e3c246dca";
  var api_secret = "ac8af199056669266585dd34ee7680be";
	// Loop over all registered users

	UserModel.find({}, function(err, docs) {
		for(i in docs) {
			console.log(docs[i]);
			var fb_user = docs[i].user;
			var fb_oath = docs[i].auth;
			var uids = docs[i].uid;
			var namespace = "facebook.com";

			var url = "http://api.face.com/faces/recognize.json?api_key=" + api_key +"&api_secret=" + api_secret + "&urls=" + photo + "&uids=" +
								uids + "&namespace=" + namespace + "&detector=Aggressive&attributes=all&user_auth=fb_user:" + fb_user + ",fb_oauth_token:" + 
								fb_oath + "&";

			console.log(url);

			var callbax = function (error, response, body) {for (i in response.body.photos){console.log(response.body.photos[i]);}}
			requests({url : url, method : "POST"}, callbax);
		}
	});

	res.send();
};


var usertrain = function(req, res){
	var userd = req.body.user;
	var authd = req.body.auth;
	var uidd = userd + "@facebook.com";
	var namespaced = "facebook.com";

	console.log("user: " + userd + " has tried to authorize with " + authd + " for space :" + uidd);

	// Save user to mongodb
	var instance = new UserModel();
	instance.user = userd;
	instance.auth = authd;
	instance.uid = uidd;
	instance.save(function (err) {
  	console.log(err);
	});
	res.send();
};

// Routes

app.post('/', indexfunc);
app.post('/users', usertrain);
//app.post('/photos', photopost);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
