
/**
 * Module dependencies.
 */

var express = require('express')
	, requests = require('request')
	, http = require('http')
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
  , site   :  String
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
			var site_id = docs[i].site;
			var namespace = "facebook.com";

			var url = "http://api.face.com/faces/recognize.json?api_key=" + api_key +"&api_secret=" + api_secret + "&urls=" + photo + "&uids=" +
								uids + "&namespace=" + namespace + "&detector=Aggressive&attributes=all&user_auth=fb_user:" + fb_user + ",fb_oauth_token:" + 
								fb_oath + "&";

			console.log(url);

			var callbax = function (error, response, body) {
				for (i in response.body.photos){
					console.log(response.body.photos[i]);

					for(j in response.body.photos[i].tags) {
						for(k in response.body.photos[i].tags[j].uids) {
							if (response.body.photos[i].tags[j].uids[k].uid == uids) {
								console.log("\nMATCH!!!\n");

								// make a new posterous post
								var photo_link = response.body.photos[i].url;
								var post_text = "Wow, I sure am great!";

								// var json_param = {
								// 	"site_id" : site_id,
								// 	"post[title]" : "look I'm famous",
								// 	"post[body]" : "<p>everybody must like me</p><img src='" + photo_link + "' />",
								// 	"post[tags]" : "twinderella, twitter, face.com, phd2",
								// 	"post[autopost]" : 0,
								// 	//"post[display_date" : ,
								// 	 "post[source]" : "http://twinderella.me",
								// 	 "post[is_private]" : 0,
								// }

								var rekdata = ["site_id="+site_id,"&post[title]=look I'm famous","&post[body]=<p>"+ req.body.tweet_t +"</p><img src='" + photo_link + "' />","&post[tags]=twinderella, twitter, face.com, phd2","&post[autopost]=0","&post[source]="+ req.body.tweet , "&post[display_date=" + req.body.time_received,"&post[is_private]=0", "&api_token=vsbpJJGisCGibogmzJCEAdcobHtIpGua"];
								rekdata = rekdata.join('');

								var options = {
									host: 'www.posterous.com',
									port: 80,
									path: '/api/2/sites/' + site_id + '/posts',
									method: 'POST',
									auth : 'scott@artsicle.com:4braves', 
									headers: {
										'Content-Length' : Buffer.byteLength(rekdata,'utf8')
										}
									};

								var rek = http.request(options, function(res) {
								  console.log('STATUS: ' + res.statusCode);
								  console.log('HEADERS: ' + JSON.stringify(res.headers));
								  res.setEncoding('utf8');
								  res.on('data', function (chunk) {
								    console.log('BODY: ' + chunk);
								  });
								});

								rek.on('error', function(e) {
								  console.log('problem with request: ' + e.message);
								});

								// write data to request body
								rek.write(rekdata);
								rek.end();
							}
						}
					}
				}
			}

			requests({url : url, method : "POST"}, callbax);
		}
	});

	res.end();
};


var usertrain = function(req, res){
	var userd = req.body.user;
	var authd = req.body.auth;
	var uidd = userd + "@facebook.com";
	var site_id = req.body.site;
	var namespaced = "facebook.com";

	console.log("user: " + userd + " has tried to authorize with " + authd + " for space :" + uidd);

	// Save user to mongodb
	var instance = new UserModel();
	instance.user = userd;
	instance.auth = authd;
	instance.uid = uidd;
	instance.site = site_id;
	instance.save(function (err) {
  	console.log(err);
	});

	res.end();
};

// Routes

app.post('/', indexfunc);
app.post('/users', usertrain);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
