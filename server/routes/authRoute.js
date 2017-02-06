/**
 * Handles all authentication requests including login and logout
 * @module routes/authRoute
 */
var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

router.get('/google', passport.authenticate('google', {
    //Read more about the scope value here:
    //https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    scope: ['openid', 'email'],
    prompt: 'select_account',
  }) // end authenticate
); // end get

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/private', // take them to their private data
    failureRedirect: '/',
  }) // end authenticate
); // end get

router.get('/', function(req,res) {
  if (req.isAuthenticated()) {
    res.json({ status: true, name:req.user.googleName });
  } else {
    console.log('User is not logged in... returning false');
    res.json({ status: false });
  } // end else
}); // end get

router.get('/logout', function(req, res) {
  req.logout();
  res.sendStatus(200); // they logged out!
}); // end /logout get

module.exports = router;
