//Auth Controller
//used in login.html view
myApp.controller( 'AuthController', [ '$scope', '$http', '$window', 'AuthFactory',
 function( $scope, $http, $window, AuthFactory){

  if (verbose) console.log( 'in AuthController' );

  var authFactory = AuthFactory;
  $scope.loggedIn = authFactory.checkLoggedIn(); //NOTE: this is only run on page load
  if (verbose) console.log('AC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  if (verbose) console.log('AC. Admin:', $scope.isAdmin);

}]); // end AuthController
