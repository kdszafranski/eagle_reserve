/**
 * Handles all routing for private routes
 * @module routers/private/index
 */
var express = require('express');
var router = express.Router();

//Require subroutes

//Subroutes

//GET private.index
router.get('/', function( req,res ) {
  res.redirect('/#!/home'); // they made it!
}); // end get

module.exports = router;
