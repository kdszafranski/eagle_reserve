/**
* Middleware that checks if a user is authenticated
* @module utilities/isLoggedIn
*/
module.exports = function(req,res,next) {
  //if user is authenticated in the session, complete the request
  //TODO: add admin status here
  if (req.isAuthenticated()) {
    return next();
  } else {
    //if user is not authenticated, send an error message
    console.log('user is not authenticated');
    res.redirect('/#!/login');
  } // end else
}; // end module.exports
