const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const multer = require('multer');
const stream = require('stream');
const multiparty = require('multiparty');
const md5 = require('md5');
const Schema = mongoose.Schema;

cloudinary.config({
	cloud_name:'zsteven17',
	api_key:'446827336797156',
	api_secret:'A70veYBuM6LTP8El8QWhnr-2bIE'
});

const articleSchema = new mongoose.Schema({
	number: Number,
	id: Number,
	author: String,
	text: String,
	date: String,
	image: String,
	comments: [String]
});

var articleInfo = mongoose.model('articleInfo', articleSchema);
exports.articleInfo = articleInfo;
exports.postArticle = function(req, res, next){
  var postedArticle = new articleInfo({
		number: req.body.number,
    id: req.body.id,
    author: req.body.author,
    text: req.body.text,
    date: req.body.date,
		image: req.body.image,
    comments: req.body.comments
  });
	// console.log(req.body);
  postedArticle.save(function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
				number: req.body.number,
				id: req.body.id,
				author: req.body.author,
				text: req.body.text,
				date: req.body.date,
				image: req.body.image,
				comments: req.body.comments
      });
  });
}


exports.getArticles = function(req, res){
	articleInfo.findOne({id: req.params.id}, function(err, data){
			res.send(data);
	});
}

exports.getArticleNumber = function(req, res){
	articleInfo.find({number: req.params.number}, function(err, data){
			res.send(data);
	});
}

exports.putArticles = function(req, res){
  articleInfo.update({id: req.params.id}, {text: req.body.text}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
        id:req.params.id,
        text:req.body.text
      });
    // }
  });
}

exports.commentFirst = function(req, res){
  articleInfo.update({id: req.params.id}, {$set: {"comments.0":req.body.text}}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
				result:'success'
			});
    // }
  });
}

exports.commentSecond = function(req, res){
  articleInfo.update({id: req.params.id}, {$set: {"comments.1":req.body.text}}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
				result:'success'
			});
    // }
  });
}

exports.commentThird = function(req, res){
  articleInfo.update({id: req.params.id}, {$set: {"comments.2":req.body.text}}, {multi: true}, function(err){
    // if(err){
    //   console.error(err);
    // }
    // else{
      res.send({
				result:'success'
			});
    // }
  });
}

	exports.putImage = function(req, res){
	  multer().single('image')(req, res, ()=>doUpload1(req, res));
	}

	doUpload1 = function(req, res){
	  const uploadStream = cloudinary.uploader.upload_stream(result => {
	    // console.log(result)
	    articleInfo.updateOne({author:req.username}, {image:result.url}, {multi: true}, function(err){
	      res.send({
	        author:req.username,
	        image:result.url
	      });
	    });
	  });
	  const nStream = new stream.PassThrough();
	  nStream.end(req.file.buffer);
	  nStream.pipe(uploadStream);
	  nStream.on('end', uploadStream.end);
	}
