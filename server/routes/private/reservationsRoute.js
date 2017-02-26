var express = require('express');
var router = express.Router();
var Reservation = require('../../models/reservation');

//POST new reservation
router.post('/', function(req, res){
  console.log('in reservation route');
  //Format date to not store time
  var dateIn = req.body.dateIn.split('T')[0];

  //Construct newReservation object
  var newReservation = new Reservation ({
    dateScheduled: dateIn,
    category: req.body.categoryIn,
    item: req.body.itemIn,
    period: req.body.periodIn,
    periodArray:req.body.periodIn,
    user: req.body.username,
    roomNumber: req.body.roomNumberIn,
    numberOfStudents: req.body.numberOfStudentsIn
  }); // end newReservation

  //Marshall Variables
  var periodsIn = req.body.periodIn;

  //Define conflicts array
  var conflicts = [];

  //For each period requested for reservation
  periodsIn.map(function(period, index) {
    console.log('PERIOD-->', period, ', INDEX-->', index);
    //Check for conflicts existing in database
    Reservation.find({'dateScheduled':dateIn, 'item':req.body.itemIn, 'periodArray':{$in:[period]}},
    function( err, results){
      if (err) {
        //If there was an error, send status
        console.log(err);
        res.sendStatus(500);
      } else {

        console.log('RESULTS-->', results);

        //If there were results, push them into array
        if (results.length > 1) {
          console.log('PUSHING RESULTS-->', results);
          //push the results into the conflicts array
          conflicts.push(results);
        } // end if

        //If this is the last period in periodsIn
        if (index === (periodsIn.length-1) ) {
          console.log('last one in the array');
          console.log('CONFLICTS-->', conflicts);

          //If there were no conflicts
          if (conflicts.length < 1) {
            //Save the reservation
            newReservation.save(function(err){
              if(err){
                console.log(err);
                res.sendStatus(500);
              } else {
                res.sendStatus(201);
              }//end else
            });//end save
          } else {
            console.log('CONFLICTS EXISTED');
            res.sendStatus(500);
          } // end else

        } // end if

      } // end else
    }); // end find


  }); // end map

});//end post

// console.log('CONFLICTS', results);
// if( results.length === 0 ){
//   newReservation.save(function(err){
//     if(err){
//       console.log(err);
//       res.sendStatus(500);
//     } else {
//       res.sendStatus(201);
//     }//end else
//   });//end save
// } else {
//   res.sendStatus(400);
// } // end else

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

//DELETE reservation by id
router.delete( '/:id', function( req, res ){
  Reservation.findByIdAndRemove(req.params.id).then(function( err ){
    console.log( 'err:', err );
  }); // end findByIdAndRemove
  res.send( 200 );
}); // end delete

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

//GET reservations by username and date
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
