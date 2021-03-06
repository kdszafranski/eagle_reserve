myApp.controller( 'ManageController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal ){
  if (verbose) console.log( 'in ManageController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  if (verbose) console.log('MC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  if (verbose) console.log('MC. Admin:', $scope.isAdmin);
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

  //Filter by date set to default
  $scope.sortType = 'dateScheduled';

  //Set default filter scope values
  $scope.teacherSelected= {name: undefined};
  $scope.itemSelected= {newItem: undefined};
  $scope.categorySelected= {category: undefined};

  //Initialize datepicker popup to closed
  $scope.popup = {
    opened: false
  }; // end popup

  //Initialize date filter to an undefined child scope
  $scope.dateInfo = {
    date: undefined
  }; // end dateInfo

  // delete a reservation (admin view)
  var deleteReservation = function( userId ){
    $http.delete( '/private/reservations/' + userId )
    .then(function( response ){
      if (verbose) console.log( 'delete hit', response );
      //If the date filter is not on, get all reservations
      if (!$scope.dateInfo.date) {
        $scope.displayReservation();
      } else {
      //If it is on, get reservations by date
        $scope.getByDate($scope.dateInfo.date);
      } // end else
    });// end then
  };// end deleteReservation

  // delete a reservation (teacher view)
  var deleteReservationUser = function( userId ){
    $http.delete( '/private/reservations/' + userId )
    .then(function( response ){
      if (verbose) console.log( 'delete hit', response );
      //If the date filter is not on, get all reservations
      if (!$scope.dateInfo.date) {
        $scope.getByUsername();
      } else {
      //If it is on, get reservations by date
        $scope.getByUsernameDate($scope.dateInfo.date);
      } // end else
    });// end then
  };// end deleteReservation

  // GET all reservations to display on DOM
  $scope.displayReservation = function(){
    if (verbose) console.log( 'in displayReservation' );
    //convert today's date with moment.js
    var today = moment(new Date()).format('YYYY-MM-DD');
    $http.get( '/private/reservations/all/' + today )
    .then(function( response ){
      if (verbose) console.log('reservations', response.data);
      $scope.reservations = response.data.results;
    });// end then
  };// end displayReservation

  // Getting all Items that are currently in database to choose from
  $scope.getItems = function(){
    if (verbose) console.log("In getItems");
    $http.get( '/private/items' )
    .then(function( response ){
      if (verbose) console.log('Items', response.data.results);
      $scope.items = response.data.results;
    });// end then
  };// end getItems

  // getting only reservations for the teacher logged in
  $scope.getByUsername = function (){
    if (verbose) console.log('User is', AuthFactory.username);
    var today = moment(new Date()).format('YYYY-MM-DD');
    $http.get( '/private/reservations/user/' + AuthFactory.username + '/' + today)
    .then(function( response ){
      if (verbose) console.log('User Reservations', response);
      $scope.userReservations = response.data.results;
    });// end then
  };// end getByUsername

  $scope.getByUsernameDate = function (date){
    if (verbose) console.log('User is', AuthFactory.username);
    date = moment(date).format('YYYY-MM-DD');
    $http.get( '/private/reservations/user/date/' + AuthFactory.username + '/' + date)
    .then(function( response ){
      if (verbose) console.log('User Reservations', response);
      $scope.userReservations = response.data.results;
    });// end then
  };// end getByUsername

  // getting just the teachers in the database
  $scope.getTeachers = function(){
    if (verbose) console.log('In get teachers');
    $http({
      method: 'GET',
      url: '/private/users'
    }).then(function(response) {
      if (verbose) console.log('Teachers ', response);
      $scope.teachers = response.data.users;
    }).catch(function(err) {
      //TODO: add better error handling here
      if (verbose) console.log(err);
    }); // end $http
  }; // end getTeachers

  $scope.getByDate = function(date){
    if (verbose) console.log('In getByDate');
    //use moment.js to format date chosen
    date = moment(date).format('YYYY-MM-DD');
    $http({
      method: 'GET',
      url: '/private/reservations/' + date
    }).then(function(response){
      if (verbose) console.log('getByDate response:', response.data.results);
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
  $scope.openConfirmationModal = function (size, userId) {
    if (verbose) console.log('Open confirm delete modal', userId);
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: "deleteReservationConfirmModal.html",
      controller: 'DeleteReservationConfirmModalController',
      size: size
    }); // end modalInstance
    //Actions to take once the modal is has been closed:
    modalInstance.result.then(function (reason) {
      if (verbose) console.log('reason-->', reason.value);
      //if the modal was closed via 'confirm' btn, delete the reservation
      if (reason.value === 'confirm') {
        //if the user is an admin, run this function:
        if ($scope.isAdmin) {
          deleteReservation( userId );
        } else {
          //if the user is a teacher, run this function:
          deleteReservationUser(userId);
        } // end else
      } // end if
    }); // end modal result
  }; // end open

  //Initialize the view
  init();

  // Disable weekend selection
  var disabled = function(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  //Set datepicker options for Teacher view
  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yyyy',
    minDate: new Date(),
    startingDay: 0,
    showWeeks: false
  }; // end dateOptions

  //Set datepicker options for Admin view
  $scope.dateOptionsAdmin = {
    formatYear: 'yyyy',
    startingDay: 0,
    showWeeks: false
  }; // end dateOptions

}]); // end ManageController

// DeleteReservationConfirmModalController
myApp.controller('DeleteReservationConfirmModalController', ['$scope', '$uibModalInstance',
 function ($scope, $uibModalInstance) {
  if (verbose) console.log('in DeleteReservationConfirmModalController');

  //close the  modal
  $scope.close = function (reason) {
    $uibModalInstance.close({ value: reason });
  }; // end close

}]); // end DeleteReservationConfirmModalController
