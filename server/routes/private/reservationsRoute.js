var express = require('express');
var router = express.Router();
var Reservation = require('../../models/reservation');

router.post('/', function(req, res){
  console.log('in reservation route');
  console.log('req.body ->', req.body);
  var newReservation = new Reservation ({
    dateScheduled: req.body.dateIn,
    category: req.body.categoryIn,
    item: req.body.itemIn,
    period: req.body.periodIn
  });
  newReservation.save(function(err){
    if(err){
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }//end else
  });//end save
});//end post

router.get( '/', function( req, res ){
  console.log( 'in router.get' );
  Reservation.find({}, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get


module.exports = router;
