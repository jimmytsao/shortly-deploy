var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var mongo = require('../app/mongo');
var Url = require('../app/mongo').Url;

var mUser = require('../app/mongo').User;
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  console.log('renderIndex');
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

//Mongo Updates needed
exports.fetchLinks = function(req, res) {

  Url.find(function(err, links) {
    res.send(200, links);
  });
};


//Mongo Updates needed
exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Url.find({url: uri}, function(err, results) {
    if (results.length) {
      res.send(200, results[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Url({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err, newLink) {
          //Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

// var find = function(model, params, callback) {
//   model.find(params, callback);
// };

//Mongo Updates needed
exports.loginUser = function(req, res) {


  var username = req.body.username;
  var password = req.body.password;

  mUser.find({ username: username }, function(err, data) {
    if (!data.length) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, data[0].password, function(err, result) {
        if (result) {
          util.createSession(req, res, data);
        } else {
          res.redirect('/login');
        }
      });
    }
  });

};

//Mongo Updates needed
exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  mUser.find({ username: username }, function(err, data) {
    if (data.length) {
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      new mUser({username: username, password: password}).save(function(err, product) {
        util.createSession(req, res, product);
      });
    }
  });
};


//Mongo Updates needed
exports.navToLink = function(req, res) {

  console.log('req params: ', req.params[0], req.params);
  Url.find({code: req.params[0]}, function(err, data){

    if (!data.length){
      res.redirect('/');
    } else {
      console.log(data);
      data[0].visits++;
      data[0].save(function(){
        return res.redirect(data[0].url);
      });
    }
  });

  // Url.findOneAndUpdate({code: req.params[0]}, {$inc:{visits: 1}}, function(err, doc){
  //   console.log('doc: ',doc);
  //   console.log('err: ',err);
  //   // doc.save(function(err,prod){
  //   // });
  // });
};


  //  {$inc:{visits: 1}, {},  })




  // ({code:req.params[0]}, function( err, data){
  //   if (!data.length){
  //     res.redirect('/');
  //   } else {
  //     data.update({visits: data.visits+1}, function())
  //   }
  // }

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get ('url'));
  //       });
    // }
//   });
// };










































































































//Fetch Links
 // Url.find(function(err, data){
  //   res.send(200, data);
  // });



//Signup
 // mUser.find({username: username}, function(err, usr) {

  //   if(usr.length){
  //     res.redirect('/login');
  //   } else {
  //     var user = new mUser({username: username, password: password});
  //     user.save(function(err){
  //       util.createSession(req, res, username);
  //     });

  //   }



//Login
  // mUser.find({username: username}, function(err, usr) {

  //   if(!usr.length){
  //     res.redirect('/login');
  //   } else {
  //     bcrypt.compare(password, usr[0].password, function(err, result) {
  //       if (result) {
  //         console.log('same');
  //         util.createSession(req, res, username);
  //       } else {
  //         console.log('not same');
  //         res.redirect('/login');
  //       }
  //     });
  //   }
  // });
