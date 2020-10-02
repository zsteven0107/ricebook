const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const multer = require('multer');
const stream = require('stream');
const multiparty = require('multiparty');
const Schema = mongoose.Schema;

cloudinary.config({
	cloud_name:'zsteven17',
	api_key:'446827336797156',
	api_secret:'A70veYBuM6LTP8El8QWhnr-2bIE'
});

var userInfo = require('./auth.js').userInfo;
var loginInfo = require('./auth.js').loginInfo;
exports.getEmail = function(req, res){
  userInfo.findOne({username: req.params.user}, function(err, data){
    res.send({
      username:data['username'],
      email:data['email']
    });
  });
}

exports.putEmail = function(req, res){
  userInfo.updateOne({username: req.body.username}, {email: req.body.email}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
        username: req.body.username,
        email: req.body.email
      });
    // }
  });
}

exports.getZipcode = function(req, res){
  userInfo.findOne({username: req.params.user}, function(err, data){
    res.send({
      username:data['username'],
      zipCode:data['zipcode']
    });
  });
}

exports.putZipcode = function(req, res){
  userInfo.updateOne({username: req.body.username}, {zipcode: req.body.zipcode}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
        username: req.body.username,
        zipcode: req.body.zipcode
      });
    // }
  });
}

exports.getHeadline = function(req, res){
    userInfo.findOne({username: req.params.user}, function(err, data){
      if(data!=null){
        res.send({
          username:data['username'],
          headline:data['headline'],
					avatar:data['avatar'],
          result:"success"
        });
      }
    });
}

exports.putHeadline = function(req, res){
  userInfo.updateOne({username: req.body.username}, {headline: req.body.headline}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
        username: req.body.username,
        headline: req.body.headline
      });
    // }
  });
}

exports.getDob = function(req, res){
  userInfo.findOne({username: req.params.user}, function(err, data){
    res.send({
      username:data['username'],
      dob:data['dob']
    });
  });
}



exports.putPassword = function(req, res){
  userInfo.update({username: req.body.username}, {password: md5(req.body.password)}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
        username: req.body.username,
        result: 'success'
      });
    // }
  });
	loginInfo.update({username: req.body.username}, {password: md5(req.body.password)}, {multi: true}, function(err){
		// if(err){
		//   console.error(err);
		// }
		// else{
			res.send({
				username: req.body.username,
				result: 'success'
			});
		// }
	});
}

exports.getPassword = function(req, res){
  userInfo.findOne({username: req.params.user}, function(err, data){
    res.send({
      username:data['username'],
      password:data['password']
    });
  });
}

exports.putAvatar = function(req, res){
  multer().single('avatar')(req, res, ()=>doUpload(req, res));
}

doUpload = function(req, res){
  const uploadStream = cloudinary.uploader.upload_stream(result => {
    // console.log(result)
    userInfo.updateOne({username:req.username}, {avatar:result.url}, {multi: true}, function(err){
      res.send({
        username:req.username,
        avatar:result.url
      });
    });
  });
  const nStream = new stream.PassThrough();
  nStream.end(req.file.buffer);
  nStream.pipe(uploadStream);
  nStream.on('end', uploadStream.end);
}

exports.getAvatar = function(req, res){
  userInfo.findOne({username:req.params.user}, function(err,data){
    res.send({
      username:req.params.user,
      avatar:data['avatar']
    });
  });
}
