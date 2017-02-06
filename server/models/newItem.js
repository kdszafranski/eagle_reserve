var mongoose = require('mongoose');

// schema used to add a new reservation to the database
var ItemSchema = mongoose.Schema({
  newItem: String,
  category: String
});

var Item = mongoose.model('items', ItemSchema);
module.exports = Item;
