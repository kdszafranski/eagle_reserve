myApp.controller( 'ManageController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory ){
  console.log( 'in ManageController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('MC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('MC. Admin:', $scope.isAdmin);
  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } // end if

  // GET to display on DOM
  $scope.displayReservation = function(){
    console.log( 'in displayReservation' );
    $http.get( '/private/reservations' )
    .then(function( response ){
      console.log('reservations', response.data);
      $scope.reservations = response.data.results;
    });// end then
  };// end displayReservation

  //  Getting all reservations from the data base
  $scope.displayReservation();

// Getting all Items that are currently in database to choose from
  $scope.getItems = function(){
    console.log("In getItems");
    $http.get( '/private/items' )
    .then(function( response ){
      console.log('Items', response.data.results);
      $scope.items = response.data.results;
    });// end then
  };// end getItems

// Getting all the Items in the database and making them selectable
  $scope.getItems();

  // delete item
  $scope.deleteReservation = function( indexIn ){
      $http.delete( '/private/reservations/' + $scope.reservations[ indexIn ]._id )
      .then(function( response ){
        console.log( 'delete hit', response );
        $scope.displayReservation();
      });
    };

}]); // end ManageController
