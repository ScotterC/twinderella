/*
	*	Get users data and write to MongoDB
	*/

var User = new Schema({
		user  :  type: String
  , auth  :  type: String
  , uid   :  type: String	
	});

var UserModel = mongoose.model('BlogPost', BlogPost);

exports.users = function(req, res){
	userd = req.body.user;
	authd = red.bidy.auth;
	uidd = userd + "@facebook.com";
	namespaced = "facebook.com";

	var instance = new UserModel();
	instance.user = userd;
	instance.auth = authd;
	instance.uid = uidd;
	instance.save;


};