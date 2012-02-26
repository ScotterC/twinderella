/*
	*	Get users data and write to MongoDB
	*/

var User = new Schema({
		user  :  type: String
  , auth  :  type: String
  , uid   :  type: String	
	});

var UserModel = mongoose.model('User', User);

exports.users = function(req, res){
	console.log("users");
	userd = req.body.user;
	authd = red.bidy.auth;
	uidd = userd + "@facebook.com";
	namespaced = "facebook.com";

	console.log("user: " + userd + "has tried to authorize with " + authdd + "for space :" + uidd);

	var instance = new UserModel();
	instance.user = userd;
	instance.auth = authd;
	instance.uid = uidd;
	instance.save;

	UserModel.find({}, function(err, docs) {
		for(i in docs) {
			concole.log(i);
		}
	})

};