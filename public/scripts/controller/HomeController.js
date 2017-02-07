myApp.controller( 'HomeController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory){
  console.log( 'in HomeController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('HC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('HC. Admin:', $scope.isAdmin);

  $scope.clear = function() {
    //Clear the datepicker
    $scope.date = null;
  }; // end clear

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  var disabled = function(data) {
    // Disable weekend selection
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  var init = function() {
    console.log('in init');
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

  }; // end init

  //Set datepicker default day to today
  $scope.today = function() {
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
