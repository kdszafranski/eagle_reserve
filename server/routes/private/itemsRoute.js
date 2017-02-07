var express = require('express');
var router = express.Router();
var Item = require('../../models/newItem');

router.post('/', function(req, res, next){
  console.log( 'in newItem POST', req.body );
  var newItem = {
    newItem: req.body.newItem,
    category: req.body.category
  };
  Item.create(newItem, function(err, next){
    if(err){
      res.sendStatus(404);
    } else {
      res.send(200);
    }
  });// end Item.create
});// end post call

router.get( '/', function( req, res ){
  console.log( 'in router.get' );
  Item.find({}, function( err, results){
    if( err ){
      console.log( err );
      res.sendStatus(500);
    } else {
      res.send({ results });
    } // end else
  }); // end find
}); // end get

// delete item
router.delete( '/:id', function( req, res ){
  Item.findByIdAndRemove(req.params.id).then(function( err ){
    console.log( 'err:', err );
  });
  res.send( 200 );
});

module.exports = router;
