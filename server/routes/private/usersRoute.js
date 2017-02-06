var express = require('express');
var router = express.Router();
var User = require('../../models/user');

//GET all users
router.get('/', function(req,res) {
  User.find({}, function(err, results) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send({ users: results });
    } // end else
  }); // end find
}); // end get

//UPDATE user permissions
router.put('/', function(req,res) {
  console.log('user put route hit', req.body);
  res.sendStatus(200);
}); // end put

module.exports = router;
