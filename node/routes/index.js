
/*
 * POST photos
 */

requests = require('request'); 

exports.index = function(req, res){
	console.log("Request hit index");
	var photo = req.body.photo;

	var api_key = "9c62b0d2526dee43a19e9a2e3c246dca";
  var api_secret = "ac8af199056669266585dd34ee7680be";

  var uids = "100000986734977@facebook.com";//"#{omniauth[:uid]}@facebook.com"
  var namespace = "facebook.com";
  var fb_user = "100000986734977";
  var fb_oath = "AAAAAONWunw0BAKfYsGySez4oZBI7ljWdUXERDfzECkzsjhJT78mEgHFLMoMMbRsLgXGn1wjHZBUi946BzZBmC3YlCNnq63XJBiAP9zvNwZDZD";

	var url = "http://api.face.com/faces/recognize.json?api_key=" + api_key +"&api_secret=" + api_secret + "&urls=" + photo + "&uids=" +
	uids + "&namespace=" + namespace + "&detector=Aggressive&attributes=all&user_auth=fb_user:" + fb_user + ",fb_oauth_token:" + fb_oath + "&";

	console.log(url);
	var callbax = function (error, response, body) {for (i in response.body.photos){console.log(response.body.photos[i]);}}
	requests({url : url, method : "POST"}, callbax);

};
