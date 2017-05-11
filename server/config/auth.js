/**
  * @module config/auth
  * Google Cloud API credentials that allows the application to
  * make calls to a Google API.
*/

var authConfigs = {
  googleAuth: {
    clientId: process.env.ER_GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.ER_GOOGLE_AUTH_CLIENT_SECRET,
    callbackUrl: process.env.ER_GOOGLE_AUTH_CALLBACK_URL,
  }, // end googleAuth
  sessionVars: {
    secret: process.env.ER_SESSION_SECRET,
  }, // end sessionVars
}; // end authConfigs

module.exports = authConfigs;
