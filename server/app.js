require('dotenv').config();
var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express ();
var bodyParser = require ('body-parser');
var session = require ('express-session');

//Require custom app modules
var configs = require('./config/auth');
var passport = require('./config/passport');
var isLoggedIn = require('./utilities/isLoggedIn');
var private = require('./routes/private/index');

var mongoose = require ('mongoose');
var connection = require('./config/connection.js');
mongoose.connect(connection);

/**Session and Create Storage
 * Creates session that will be stored in memory
 * TODO: Before deploying to production,
 * configure session store to save to DB instead of memory (default);
*/
app.use(session({
  secret: configs.sessionVars.secret,
  key: 'user',
  resave: 'true',
  saveUninitialized: false,
  cookie: { maxage: 60000, secure: false },
})); // end session Create

//****MIDDLEWARE****//
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
//Passport
app.use(passport.initialize()); // kickstart passport
app.use(passport.session()); //Alter request objec to include user object

//****ROUTERS****//
var auth = require('./routes/authRoute');
app.use('/auth', auth);
app.use('/private', isLoggedIn, private);

//****SPIN UP SERVER****//
app.listen(PORT, function() {
  console.log('server listening on', PORT);
}); // end listen

//****BASE URL****//
var indexRoute = require('./routes/indexRoute');
app.use('/', indexRoute);

module.exports = app;
