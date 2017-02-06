//Auth Controller
//used in login.html view
myApp.controller( 'AuthController', [ '$scope', '$http', '$window', 'AuthFactory',
 function( $scope, $http, $window, AuthFactory){

  console.log( 'in AuthController' );
  
  var authFactory = AuthFactory;
  $scope.loggedIn = authFactory.checkLoggedIn(); //NOTE: this is only run on page load
  console.log('AC. Logged in:', $scope.loggedIn);

}]); // end AuthController
