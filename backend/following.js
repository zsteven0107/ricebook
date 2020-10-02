const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userInfo = require('./auth.js').userInfo;
exports.putFollowing = function(req, res){
	userInfo.update({username: req.body.username}, {'$addToSet': {following:req.params.user}}, function(err,data) {
//   	if (err) {
//     	console.log(err);
//     }
		// else {
    	res.send({
					user: req.body.username,
					newFollowing: req.params.user,
					result: 'success'
				});
//     }
  });
}

exports.getFollowing = function(req, res){
	userInfo.findOne({username: req.params.user}, function(err, data){
		if(data!=null){
			res.send(data['following']);
		}
	});
}

exports.deleteFollowing = function(req, res){
	console.log(req.username)
	userInfo.update({username: req.username}, {'$pull': {following:req.params.user}} ,{ multi: true }, function(err, data){
		res.send(data);
	});
}
