var express = require('express');
var router = express.Router();
var Reservation = require('../../models/reservation');

//POST new reservation
router.post('/', function(req, res){
  console.log('in reservation route');
  console.log('req.body ->', req.body);
  //Split the date string so it is store without time
  //TODO: take out the split once datepicker and moment.js have been implemented
  var dateIn = req.body.dateIn.split('T')[0];
  console.log(dateIn);
  var newReservation = new Reservation ({
    dateScheduled: dateIn,
    category: req.body.categoryIn,
    item: req.body.itemIn,
    period: req.body.periodIn,
    user: req.body.username,
    roomNumber: req.body.roomNumberIn,
    numberOfStudents: req.body.numberOfStudentsIn
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

//GET all reservations
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

//GET reservations by date for past dates in manageReservations view
router.get( '/all/:date', function( req, res ){
  console.log( 'in router.get reservation by date', req.params.date);
  var date = req.params.date;
  console.log('Date', date);
  Reservation.find({"dateScheduled": { $gte: date }}, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

//GET reservations by date
router.get( '/date/:date', function( req, res ){
  console.log( 'in router.get by date:');
  //Split the date string so it is store without time
  var date = req.params.date;
  console.log(date);
  Reservation.find({ 'dateScheduled': date  }, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

router.delete( '/:id', function( req, res ){
  Reservation.findByIdAndRemove(req.params.id).then(function( err ){
    console.log( 'err:', err );
  });
  res.send( 200 );
});

//GET only user reservations
router.get( '/user/:username/:date', function( req, res ){
  console.log( 'in find only by username' );
  Reservation.find({'user': req.params.username, 'dateScheduled':{$gte: req.params.date} }, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

//GET reservations by date for manage reservations
router.get( '/:dateSpecific', function( req, res ){
  console.log( 'in router.get by dateSpecific:');
  //Split the date string so it is store without time
  var date = req.params.dateSpecific;
  console.log(date);
  Reservation.find({ 'dateScheduled': date  }, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get


//GET reservations by date and item name (reserveController)
router.get( '/multiple/:date/:item', function( req, res ){
  console.log( 'in reservationRouter.get/multiple');
  var date = req.params.date;
  var item = req.params.item;
  Reservation.find({ 'dateScheduled': date, 'item': item  }, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

//GET reservations for date range (week view)
router.get('/range/:start/:end', function(req,res) {
  console.log('reservationRoute /range route hit. Req.params-->', req.params);
  Reservation.find({ 'dateScheduled': { $gte: req.params.start, $lte: req.params.end }}, function( err, results ){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

router.get( '/user/date/:username/:date', function( req, res ){
  console.log( 'in find only by username' );
  Reservation.find({'user': req.params.username, 'dateScheduled': req.params.date }, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

module.exports = router;
