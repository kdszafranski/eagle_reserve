/**
 * Handles all routing for private routes
 * @module routers/private/index
 */
var express = require('express');
var router = express.Router();

//Require subroutes
var reservations = require('./reservationsRoute');
var items = require('./itemsRoute');
var users = require('./usersRoute');
var email = require('./emailRoute');

//Subroutes
router.use('/reservations', reservations);
router.use('/items', items);
router.use('/users', users);
router.use('/email', email);

//GET private.index
router.get('/', function( req,res ) {
  res.redirect('/#!/home'); // they made it!
}); // end get

module.exports = router;
