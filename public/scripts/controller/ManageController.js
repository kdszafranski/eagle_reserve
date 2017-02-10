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
    $http.get( '/private/reservations/all/' + new Date().toISOString() )
    .then(function( response ){
      console.log('reservations', response.data);
      $scope.reservations = response.data.results;
    });// end then
  };// end displayReservation


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

  // delete a reservation
  $scope.deleteReservation = function( indexIn ){
    $http.delete( '/private/reservations/' + $scope.reservations[ indexIn ]._id )
    .then(function( response ){
      console.log( 'delete hit', response );
      $scope.displayReservation();
    });// end then
  };// end deleteReservation


  // delete a reservation
  $scope.deleteReservationUser = function( indexIn ){
    $http.delete( '/private/reservations/' + $scope.userReservations[ indexIn ]._id )
    .then(function( response ){
      console.log( 'delete hit', response );
      $scope.getByUsername();
    });// end then
  };// end deleteReservation

  // getting only reservations for the teacher logged in
  $scope.getByUsername = function (){
    console.log('User is', AuthFactory.username);
    $http.get( '/private/reservations/user/' + AuthFactory.username )
    .then(function( response ){
      console.log('User Reservations', response);
      $scope.userReservations = response.data.results;
    });// end then
  };// end getByUsername

  // getting just the teachers in the database
  $scope.getTeachers = function(){
    console.log('In get teachers');
    $http({
      method: 'GET',
      url: '/private/users'
    }).then(function(response) {
      console.log('Teachers ', response);
      $scope.teachers = response.data.users;
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getTeachers

  // getting all the teachers
  $scope.getTeachers();

  $scope.category = [
    {category: "Lab"},
    {category: "Cart"},
    {category: "Equipment"}
  ];

  $scope.teacherSelected= {name: undefined};
  $scope.itemSelected= {newItem: undefined};
  $scope.categorySelected= {category: undefined};

  $scope.getByDate = function(date){
    console.log('In getByDate');
    var specificDate = date.toISOString();
    $http({
      method: 'GET',
      url: '/private/reservations/' + specificDate
    }).then(function(response){
      console.log('getByDate response:', response.data.results);
      $scope.reservations = response.data.results;
    });

  };

  $scope.popup = {
    opened: false
  }; // end popup

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick


}]); // end ManageController
