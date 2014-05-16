var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');


//
//Connection Information
//
//
var con = process.env.MONGO || 'mongodb://127.0.0.1:27017'
mongoose.connect(con);

var mongodb = mongoose.connection;

mongodb.on('error', function(error){
  console.log('there was an error: ', error);
});

mongodb.on('open', function(data){
  console.log('connection successful', data);
});

//
//URL Schemas and Models
//
var urlSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {
    type: Number,
    default: 0
  }
});

urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

//
//User Schemas and Models
//
  var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  console.log('pre-save');
  console.log(this);
  var that = this;
  bcrypt.hash(this.password, null, null, function(err, hash) {
    that.password = hash;
    console.log(hash);
    next();
  });
});


exports.User = mongodb.model('Users', userSchema);
exports.Url = mongodb.model('Urls', urlSchema);

// User.prototype.comparePassword = function(attemptedPassword, callback) {
//   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//     callback(isMatch);
//   });
// };


// var user = new User({
//   username: 'sldfjaskdf',
//   password: 'password'
// });

// User.find({username: 'sldfjaskdf'}, function(err, u) {
//   console.log(u);
// });

// var dbUser = User.find({username: user.username}, function(err, usr) {
//   console.log(user.password);
//   bcrypt.compare(user.password, usr[0].password, function(err, result) {
//     if (result) {
//       console.log('same');
//     } else {
//       console.log('not same');
//     }
//   });
// });

// user.comparePassword(callback) {
//   User.find({username: this.username})

// }

// user.save(function(err, product, numberAffected) {
//   console.log('this is save');
//   console.log(err);
//   console.log(product);
//   console.log(numberAffected);
// });
