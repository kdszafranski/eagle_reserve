var mongoose = require('mongoose');

// schema used to add a new reservation to the database
var ItemSchema = mongoose.Schema({
  newItem: String,
  category: String
});

module.exports = mongoose.model('newItem', ItemSchema);
