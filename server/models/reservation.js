var mongoose = require('mongoose');

// schema used to add a new reservation to the database
var ReservationSchema = mongoose.Schema({
  dateScheduled: Date,
  category: String,
  item: String,
  user: String,
  period: String,
  periodArray: [String],
  roomNumber: String,
  numberOfStudents: Number,

});

module.exports = mongoose.model('Reservation', ReservationSchema);
