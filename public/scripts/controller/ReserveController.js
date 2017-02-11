myApp.controller( 'ReserveController', [ '$scope', '$http', '$location', 'AuthFactory', "$uibModal",
function( $scope, $http, $location, AuthFactory, $uibModal ){
  console.log( 'in ReserveController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('RC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('RC. Admin:', $scope.isAdmin);
  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } // end if

  //pull the username in from authFactory and store as variable
  var username = authFactory.username;

  var disabled = function(data) {
    // Disable weekend selection on daypicker
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  var init = function() {
    //set periodArray and selection scopes
    $scope.periodArray = ['BS', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'AS'];
    $scope.selection = [];
    $scope.categories = [];

    //set newReservation defaults
    $scope.newReservation = {
      categoryIn: '',
      itemIn: '',
      dateIn: '',
      periodIn: '',
      username: username
    }; // end newReservation

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

    getAllItems();
  }; // end init

  var getAllItems = function() {
    //GET all items from the database
    $http({
      method: 'GET',
      url: '/private/items'
    }).then(function(response) {
      console.log('response for items ->', response);
      $scope.items = response.data.results;
      //set categories array for select values
      setCategorySelectOptions(response.data.results);
    }); //end http
  }; // end getAllItems

  var setCategorySelectOptions = function(resultsArray) {
    console.log('in setCategorySelectOptions');
    //for each item in resultsArray
    for (var i = 0; i < resultsArray.length; i++) {
      var category = resultsArray[i].category;
      //If the category is not already in $scope.category
      // push the value into the array
      if ($scope.categories.indexOf(category) === -1) {
        $scope.categories.push(category);
      } // end if
    } // end for
  }; // end setCategorySelectOptions

  $scope.toggleSelection = function toggleSelection(periodName) {
    console.log('in toggleSelection');
    var idx = $scope.selection.indexOf(periodName);
    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.selection.push(periodName);
    }
    //update current period selections in newReservation object
    $scope.newReservation.periodIn = $scope.selection;
  }; // end toggleSelection

  //open the modal (returns a modal instance)
  $scope.open = function (size, newReservation) {
    //open the modal
    console.log('Open confirm reservation modal');
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: "confirmReservationModal.html",
      controller: 'ConfirmReservationModalController',
      size: size,
      //pass the userId to DeleteUserModalController
      resolve: {
        newReservation: function () {
          return newReservation;
        } // end userId
      } // end resolve
    }); // end modalInstance
    //when the modal instance is closed, show the confirmation alert
    modalInstance.closed.then(function(){
      var item = $scope.newReservation.itemIn;
      var date = $scope.newReservation.dateIn;
      var period = $scope.newReservation.periodIn;
      $scope.roomNumberIn = '';
      $scope.numberOfStudentsIn = '';
      $scope.outputDiv += '<p>' + 'You have added a reservation for ' + item + ' on ' + date + ' for period ' + period + '</p>';
    }); // end modalInstance.closed callback
  }; // end open

  init();

}]); // end ReserveController

// confirmation modal
myApp.controller('ConfirmReservationModalController', ['$scope', '$http', '$uibModalInstance', 'newReservation',
function ($scope, $http, $uibModalInstance, newReservation) {
  console.log('in ConfirmReservationModalController', newReservation);

  $scope.makeReservation = function (){
    console.log('In Make Reservation', newReservation);
    $http ({
      method: 'POST',
      url: '/private/reservations',
      data: newReservation,
    }).then(function(response) {
      console.log('makeReservation response ->', response);
      $scope.sendEmail();
      $scope.close();
    }); // end $http
  };//end make Reservation

  // send email
  $scope.sendEmail = function( req, res ) {
    //post info to the server
    $http({
      method: 'POST',
      url: '/private/email'
    }).then(function(response) {
      console.log('sendEmail response-->', response);
    }).catch(function(err) {
      //if there was an error, log it
      console.log(err);
    }); // end $http
  }; // end sendEmails

  //close the  modal
  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  }; // end close


}]); // end ConfirmReservationModalController
