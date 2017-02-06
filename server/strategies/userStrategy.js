/**
* A strategy layer that makes all of our Admin database queries.
* @module strategies/userStrategy
*/
var User = require('../models/user');

var UserService = {
  //find a user by thier unique Mongo id
  findUserById: function (id, callback) {
    User.findById(id, function(err, user) {
      if (err) {
        return callback(err, null);
      } // end if
      return callback(null, user);
    }); // end User.findById
  }, // end findUserById

  //finds a User by their Google Id
  findUserByGoogleId: function(id, callback) {
    User.findOne( { googleId: id }, function(err, user) {
      if (err) {
        return callback(err, null);
      } // end if
      return callback(null, user);
    }); // end findOne
  }, // end findUderByGoogleId

  //Create a User that will be authenticated by Google
  createGoogleUser: function(id, token, name, email, callback) {

    var user = new User();

    user.googleId = id;
    user.googleToken = token;
    user.name = name;
    user.email = email;
    user.admin = false;
    user.teacher = true;

    user.save(function(err) {
      if (err) {
        return callback (err, null);
      } // end if
      return callback(null, user);
    }); // end save
  } // end createGoogleUser
}; // end UserService

module.exports = UserService;
