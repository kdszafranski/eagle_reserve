var mongoose = require('mongoose');

// schema used to add a new reservation to the database
var ReservationSchema = mongoose.Schema({
  dateScheduled: Date,
  item: String,
  user: String,
  period: String,
  roomNumber: String
});

module.exports = mongoose.model('Reservation', ReservationSchema);
