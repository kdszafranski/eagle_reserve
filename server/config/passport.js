/**
 * @module config/passport.js
 * Configure the instance of passport
 * Serialize & Deserialize user info
 * Define the authentication strategy
*/

//Require node modules
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

//Require custom app modules
var configs = require('auth');

//all db queries moved to a service layer, necessary for proper unit testing
var UserStrategy = require('../strategies/UserStrategy');

//Passport Session Serialization
//Serialize the user onto the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
}); // end serializeUser

//Deserialize the user from the session and provide user object
passport.deserializeUser(function(id, done) {
  UserStrategy.findUserById(id, function(err, user) {
    if (err) {
      return done(err);
    } // end if
    return done(null, user);
  }); // end UserStrategy.findUserById
}); // end deserializeUser

// Passport Strategy Definition
passport.use('google', new GoogleStrategy({
  // identify ourselves to Google and request Google user data
  clientID: configs.googleAuth.clientId,
  clientSecret: configs.googleAuth.clientSecret,
  callbackURL: configs.googleAuth.callbackUrl,
}, function (token, refreshToken, profile, done) {
  // Google has responded
  // does this user exist in our database already?
  UserStrategy.findUserByGoogleId(profile.id, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) { // user does exist!
        return done(null, user);
      }
      // user does not exist in our database, let's create one!
      UserStrategy.createGoogleUser(profile.id, token, profile.displayName,
        profile.emails[0].value, /* we take first email address */
        function (err, user) {
          if (err) {
            return done(err);
          }
          return done(null, user);
        }); // end createGoogleAdmin
    }); // end findAdminByGoogleId
})); // end use

module.exports = passport;
