const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sessionUser = {}
const cookieKey = 'sid'
// const bcrypt = require("bcrypt");
const md5 = require('md5');
// const redis = require('redis').createClient(process.env.REDIS_URL || 6379);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// const saltRound = 10;
var articleInfo = require('./articles.js').articleInfo;
exports.passport = passport;
const loginSchema = new mongoose.Schema({
  username: {type:String, unique:true},
  password: String,
  salt: String
});

const userSchema = new mongoose.Schema({
  username: {type:String, unique:true},

  password: String,
  salt: String,
  email: String,
  zipcode: String,
  dob: String,
  headline: String,
  following: [String],
  avatar: String
})

var loginInfo = mongoose.model('loginInfo', loginSchema);
var userInfo = mongoose.model('userInfo', userSchema);
exports.loginInfo = loginInfo;
exports.userInfo = userInfo;
exports.authRegister = function(req, res){
  // let enPassword = req.body.password;
  // const salt = bcrypt.genSaltSync(saltRound);
  // var hash = bcrypt.hashSync(enPassword, salt);
  // enPassword = hash;
  var registerUser = new userInfo({
    username: req.body.username,
    password: md5(req.body.password),
    salt: "salt",
    email: req.body.email,
    zipcode: req.body.zipcode,
    dob: req.body.dob,
    headline: req.body.headline,
    following: req.body.following,
    avatar: req.body.avatar
  });
  registerUser.save(function(err){
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
  var loginUser = new loginInfo({
    username: req.body.username,
    password: md5(req.body.password),
    salt: "salt"
  });
  loginUser.save(function(err){
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


exports.authLogin = function(req, res){
  loginInfo.findOne({username:req.body.username}).then(loginInfo => {
    // console.log(loginInfo)
    if(!loginInfo){
      res.send({
        result: 'No such user'
      });
    }
    if(md5(req.body.password)!=loginInfo.password){
//      console.log(md5(req.body.password))
//      console.log(loginInfo.password)
      res.send({
        result: 'password not match'
      })
    }
    const sessionKey = md5("I like web" + new Date().getTime() + loginInfo.username);
    // redis.hset('sessionUser',sessionKey, loginInfo.username)
    sessionUser[sessionKey] = loginInfo;
    res.cookie('cookieKey', sessionKey, {maxAge:3600*1000, httpOnly:true});
    res.send({
      result:'success'
    })
  });
}

exports.isLoggedIn = function(req, res, next){
  // console.log(req.cookies.cookieKey);

  const sid = req.cookies.cookieKey;
  req.username = sessionUser[sid].username;
  // redis.hget('sessionUser', sid, function(err, data){
  //   var rUsername = data;
  //   // console.log(rUsername);
  //   // console.log('11');
  //   req.username = rUsername;
  // })
  if(sid){
    next();
  }
}

exports.authLogout = function(req, res){
  const sid = req.cookies.cookieKey;
  // redis.del('sessionKey', sid);
  delete sessionUser[sid];
}

passport.use(new FacebookStrategy({
  clientID:'439887113611214',
  clientSecret:'1755f29a41ab19e7d58fe72b15b87b68',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ["email","name"]
}, function(accessToken, refreshToken, profile, done){
  const {first_name, last_name} = profile._json;
  loginInfo.findOne({username:first_name},function(err,loginInfo){
    if(!loginInfo){
      var loginUser = new loginInfo({
        username: first_name,
        password: md5('facebookLogin'),
        salt: "salt"
      });
      loginUser.save();
      var registerUser = new userInfo({
        username: first_name,
        password: md5("facebookLogin"),
        salt: "salt",
        email: 'sz@facebook.com',
        zipcode: '77005',
        dob: '',
        headline: '',
        following: [],
        avatar: ''
      });
      registerUser.save();
      articleInfo.countDocuments({}, function(err,count){
        for(var i=0;i<5;i++){
          var date = new Date();
          var newArticle = {
            number: 1,
            id: count+i,
            author: first_name,
            text: "fffff",
            date: date.toLocaleDateString('en-US')+date.toLocaleTimeString('en-US'),
            image: '',
            comments: []
          }
          articleInfo(newArticle).save();

        }
        var user1 = {"username":first_name};
        done(null,user1);
      })
    }
    else{
      done(null,user);
    }
  })
}));

passport.serializeUser(function(user, done){
  done(null, user)
});
passport.deserializeUser(function(user, done){
  done(null, user)
});

exports.fbLogin = function(req,res){
  const sessionKey = md5("I like web" + new Date().getTime() + loginInfo.username);
  redis.hset('sessionUser',sessionKey, loginInfo.username)
  // sessionUser[sessionKey] = loginInfo;
  res.cookie('cookieKey', sessionKey, {maxAge:3600*1000, httpOnly:true});
  res.redirect('http://localhost:4200/main');
}
