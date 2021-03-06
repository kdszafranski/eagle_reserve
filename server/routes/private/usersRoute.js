var verbose = false;
var express = require('express');
var router = express.Router();
var User = require('../../models/user');

//GET all users
router.get('/', function(req,res) {
  User.find({}, function(err, results) {
    if (err) {
      if (verbose) console.log(err);
      res.sendStatus(500);
    } else {
      res.send({ users: results });
    } // end else
  }); // end find
}); // end get

//UPDATE user permissions
router.put('/', function(req,res) {
  //marshall variables
  var userId = req.body.id;
  var newAdminStatus = req.body.permissions;
  User.update({'_id': userId },{ $set:{ 'admin' : newAdminStatus } }, function(err, results) {
    if (err) {
      if (verbose) console.log(err);
      res.sendStatus(500);
    } else {
      if (verbose) console.log('updated-->', userId, results);
      res.sendStatus(201);
    } // end else
  }); // end update
}); // end put

//UPDATE user name
router.put('/name', function(req,res) {
  //Marshall variables
  var userId = req.body.id;
  var newName = req.body.name;
  User.update({'_id': userId },{ $set:{ 'name' : newName } }, function( err, results ) {
    if (err) {
      if (verbose) console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    } // end else
  }); // end update
}); // end put

//DELETE user by ID value
router.delete('/:id', function(req, res) {
  var userId = req.params.id;
  User.remove( { '_id': userId }, function(err) {
    if (err) {
      if (verbose) console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    } // end else
  }); // end remove
}); // end delete

module.exports = router;
