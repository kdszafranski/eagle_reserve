var mongoose = require('mongoose');

// schema to add a new User to the database
var UserSchema = mongoose.Schema({
  name: String,
  email: String,
  teacher: Boolean,
  admin: Boolean
});

module.exports = mongoose.model('User', UserSchema);
