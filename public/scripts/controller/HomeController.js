myApp.controller( 'HomeController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal){
  console.log( 'in HomeController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('HC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('HC. Admin:', $scope.isAdmin);

  var username = authFactory.username;
  console.log('username-->', username);

  var disabled = function(data) {
    // Disable weekend selection on daypicker
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  var getReservationsByDate = function(date) {
    console.log('in getReservationsByDate');
    //convert date to ISO String format
    date = date.toISOString();
    //Get all reservations for selected date
    $http({
      method: 'GET',
      url: 'private/reservations/date/' + date,
    }).then(function(response) {
      console.log('getReservationsByDate response-->',response.data.results);
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getAll

  var init = function() {
    console.log('in init');

    //Get all reservations for today
    getReservationsByDate(new Date());

    //TODO: get all items from the database to replace this
    $scope.allItems = [
      {name: 'Chrome1'},
      {name: 'Chrome2'},
      {name: 'Chrome3'},
      {name: 'Chrome4'},
      {name: 'Chrome5'},
      {name: 'MMS Mac Cart'},
      {name: 'Lab1'},
      {name: 'Lab2'},
      {name: 'Lab116'},
      {name: 'Media Center'},
      {name: 'Mezzanine'},
      {name: 'MMS'},
      {name: 'Greek Theater'},
      {name: 'Pit'}
    ]; // end allItems

    //Initialize datepicker default to today
    $scope.today();
    //Initialize datepicker popup to closed
    $scope.popup = {
      opened: false
    }; // end popup

    //Set datepicker options
    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 1,
      showWeeks: false
    }; // end dateOptions

    //Require user to add their name within the modal
    //Run only after the entire view has been loaded
    angular.element(document).ready(function() {
      //If the username is blank, open modal
      if (username.length < 1) {
        openUsernameModal('md');
      } // end if
    }); // end doc ready function

  }; // end init

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  //open username modal (returns a modal instance)
  openUsernameModal = function (size) {
    //open the modal
    console.log('Open Username Modal');
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: 'updateUsernameModal.html',
      controller: 'UpdateUsernameModalController',
      size: size
    }); // end modalInstance
  }; // end openUsernameModal

  $scope.today = function() {
    //Set datepicker default day to today
    $scope.date = new Date();
  }; // end today();

  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } else {
    //If they are logged in, initialize the view
    init();
  } // end else

}]); // end HomeController

//UpdateUsernameModalController
myApp.controller('UpdateUsernameModalController', ['$scope', '$http', '$uibModalInstance',
function ($scope, $http, $uibModalInstance) {
    console.log('in UpdateUsernameModalController');

    //close the  modal
    $scope.saveUsername = function (firstName, lastName) {
      console.log('in saveUsername', firstName, lastName);
      //Close the modal
      $uibModalInstance.dismiss('cancel');
    }; // end saveUsername

    //TODO: update username for this user

  } // end controller callback
]); // end ModalInstanceController
