myApp.controller( 'ManageController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal ){
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

  //Set category filters
  $scope.category = [
    {category: "Lab"},
    {category: "Cart"},
    {category: "Equipment"}
  ]; // end $scope.category

  //Set default filter scope values
  $scope.teacherSelected= {name: undefined};
  $scope.itemSelected= {newItem: undefined};
  $scope.categorySelected= {category: undefined};

  //Initialize datepicker popup to closed
  $scope.popup = {
    opened: false
  }; // end popup

  // delete a reservation (admin view)
  var deleteReservation = function( indexIn ){
    $http.delete( '/private/reservations/' + $scope.reservations[ indexIn ]._id )
    .then(function( response ){
      console.log( 'delete hit', response );
      $scope.displayReservation();
    });// end then
  };// end deleteReservation

  // delete a reservation (teacher view)
  var deleteReservationUser = function( indexIn ){
    $http.delete( '/private/reservations/' + $scope.userReservations[ indexIn ]._id )
    .then(function( response ){
      console.log( 'delete hit', response );
      $scope.getByUsername();
    });// end then
  };// end deleteReservation

  // GET all reservations to display on DOM
  $scope.displayReservation = function(){
    console.log( 'in displayReservation' );
    //convert today's date with moment.js
    var today = moment(new Date()).format('YYYY-MM-DD');
    $http.get( '/private/reservations/all/' + today )
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

  // getting only reservations for the teacher logged in
  $scope.getByUsername = function (){
    console.log('User is', AuthFactory.username);
    var today = moment(new Date()).format('YYYY-MM-DD');
    $http.get( '/private/reservations/user/' + AuthFactory.username + '/' + today)
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

  $scope.getByDate = function(date){
    console.log('In getByDate');
    //use moment.js to format date chosen
    date = moment(date).format('YYYY-MM-DD');
    $http({
      method: 'GET',
      url: '/private/reservations/' + date
    }).then(function(response){
      console.log('getByDate response:', response.data.results);
      $scope.reservations = response.data.results;
    });
  };

  var init = function() {
    // Getting all the Items in the database and making them selectable
    $scope.getItems();
    //Get teacher names to populate teacher select filter
    $scope.getTeachers();
  }; // end init

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  //open the modal (returns a modal instance)
  $scope.openConfirmationModal = function (size, reservationIndex) {
    console.log('Open confirm delete modal', reservationIndex);
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: "deleteReservationConfirmModal.html",
      controller: 'DeleteReservationConfirmModalController',
      size: size
    }); // end modalInstance
    //Actions to take once the modal is has been closed:
    modalInstance.result.then(function (reason) {
      console.log('reason-->', reason.value);
      //if the modal was closed via 'confirm' btn, delete the reservation
      if (reason.value === 'confirm') {
        //if the user is an admin, run this function:
        if ($scope.isAdmin) {
          deleteReservation( reservationIndex );
        } else {
          //if the user is a teacher, run this function:
          deleteReservationUser(reservationIndex);
        } // end else
      } // end if
    }); // end modal result
  }; // end open

  //Initialize the view
  init();

}]); // end ManageController

// DeleteReservationConfirmModalController
myApp.controller('DeleteReservationConfirmModalController', ['$scope', '$uibModalInstance',
 function ($scope, $uibModalInstance) {
  console.log('in DeleteReservationConfirmModalController');

  //close the  modal
  $scope.close = function (reason) {
    $uibModalInstance.close({ value: reason });
  }; // end close

}]); // end DeleteReservationConfirmModalController
