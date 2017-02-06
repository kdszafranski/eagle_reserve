/**
 * Deines User Schema
 * @module models/user
 */
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  googleId: { type: String, required: true },
  googleToken: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
  //app administrator will need to manually set users to admin status
  //as all users created will be set to false (in userStrategy)
  admin: {type: Boolean, required: true},
}); // end userSchema

module.exports = mongoose.model('User', UserSchema);
