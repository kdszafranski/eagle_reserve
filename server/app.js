var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express ();
var path = require ('path');
var session = require ('express-session');
var mongoose = require ('mongoose');
var bodyParser = require ('body-parser');
var passport = require('./strategies/userStrategy');

//Require custom app modules
var configs = require('./config/auth');
var passport = require('./config/passport');
//TODO: left off at isLoggedIn

//****REQUIRE ROUTERS****//


//****MIDDLEWARE****//
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

//****ROUTERS****//


//****SPIN UP SERVER****//
app.listen(PORT, function() {
  console.log('server listening on', PORT);
}); // end listen

//****BASE URL****//
var indexRoute = require('./routes/indexRoute');
app.use('/', indexRoute);

//****MONGO DB CONNECTION****//
var mongoURI = "mongodb://localhost:27017/eagleReserveDatabase";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function (err) {
    console.log('mongodb connection error:', err);
});

MongoDB.once('open', function () {
  console.log('mongodb connection open!');
});

module.exports = app;
