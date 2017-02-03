var express = require('express');
var router = express.Router();
var Item = require('../../models/newItem');

router.post('/', function(req, res, next){
  console.log( 'in newItem POST' );
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

module.exports = router;
