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

//Disabled drop down until categories and items are selected
  $scope.changeDropDown = function () {
    if($scope.newReservation.categoryIn == '') {
      $scope.dropDownDisabledItem = true;
      $scope.dropDownDisabledDate = true;
    } else if ($scope.newReservation.itemIn == '') {
      $scope.dropDownDisabledItem = false;
      $scope.dropDownDisabledDate = true;
    } else {
      $scope.dropDownDisabledItem = false;
      $scope.dropDownDisabledDate = false;
    }
  };//end change drop down

  var init = function() {

    $scope.dropDownDisabledItem = true;
    $scope.dropDownDisabledDate = true;

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

    $scope.reservationsMade = [];

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
    modalInstance.result.then(function (reason) {
      console.log('reason-->', reason.value, reason.reservation);

      //TODO: clear/reset the make a reservation form after modal closed

      //if the modal was closed via 'confirm' btn, display reservation confirmation alert
      if (reason.value === 'confirm') {
        //construct reservationMadeObject
        var reservationMadeObject = {
          item: reason.reservation.itemIn,
          date: reason.reservation.dateIn,
          period: reason.reservation.periodIn
        }; // end reservationMadeObject
        //push the reservation made into the $scope.reservationMade array
        $scope.reservationsMade.push(reservationMadeObject);
      } // end if
    }); // end modal result
  }; // end open

  init();

}]); // end ReserveController

// confirmation modal
myApp.controller('ConfirmReservationModalController', ['$scope', '$http', '$uibModalInstance', 'newReservation',
function ($scope, $http, $uibModalInstance, newReservation) {
  console.log('in ConfirmReservationModalController', newReservation);

  $scope.newReservation = newReservation;

  //Show the appropriate input
  //if category is Cart, show room # input
  if ($scope.newReservation.categoryIn === 'Cart') {
    $scope.isCart = true;
  //If category is not cart, show numStudents input
  } else {
    $scope.isCart = false;
  } // end else

  $scope.userInput = {
    roomNumberIn: '',
    numberOfStudentsIn: ''
  }; // end userInput

  var attachInputInfo = function(reservationObject) {
    console.log('in attachInputInfo', reservationObject);
    //If the category is Cart, attach room Number information
    if (reservationObject.categoryIn === 'Cart') {
      reservationObject.roomNumberIn = $scope.userInput.roomNumberIn;
    //If the category is NOT Cart, attach number of students information
    } else {
      reservationObject.numberOfStudentsIn = $scope.userInput.numberOfStudentsIn;
    } // end else
    return reservationObject;
  }; // end attachInputInfo

  $scope.makeReservation = function (){
    console.log('In Make Reservation');
    if ($scope.confirmReservationForm.$valid) {
      //attach the info from inputs
      newReservation = attachInputInfo(newReservation);
      //POST reservation info to server
      $http ({
        method: 'POST',
        url: '/private/reservations',
        data: newReservation,
      }).then(function(response) {
        console.log('makeReservation response ->', response);
        $scope.sendEmail(newReservation);
        $scope.close('confirm', newReservation );
      }); // end $http
    } // end if
  };//end make Reservation

  // send email
  $scope.sendEmail = function( reservation ) {
    //post info to the server
    $http({
      method: 'POST',
      url: '/private/email',
      data: reservation
    }).then(function(response) {
      console.log('sendEmail response-->', response);
    }).catch(function(err) {
      //if there was an error, log it
      console.log(err);
    }); // end $http

  }; // end sendEmails

  //close the  modal
  $scope.close = function (reason, reservation) {
    $uibModalInstance.close({ value: reason, reservation: reservation });
  }; // end close


}]); // end ConfirmReservationModalController
