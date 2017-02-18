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

  var defaultPeriodsArray = [
    { name: 'BS', reserved: false, class: 'enabled' },
    { name: 'One', reserved: false, class: 'enabled' },
    { name: 'Two', reserved: false, class: 'enabled' },
    { name: 'Three', reserved: false, class: 'enabled' },
    { name: 'Four', reserved: false, class: 'enabled' },
    { name: 'Five', reserved: false, class: 'enabled' },
    { name: 'Six', reserved: false, class: 'enabled' },
    { name: 'Seven', reserved: false, class: 'enabled' },
    { name: 'AS', reserved: false, class: 'enabled' },
  ]; // end defaultPeriodsArray

  //pull the username in from authFactory and store as variable
  var username = authFactory.username;

  var disabled = function(data) {
    // Disable weekend selection on daypicker
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }; // end disabled

  $scope.getReservations= function() {
    console.log('in getReservations');
    //Hide the table
    //$scope.tableIsVisible = false;
    //reset periods array to defaults
    resetPeriodArray();
    //set date and item variables for get call
    var currentDateSelected = moment($scope.newReservation.dateIn).format('YYYY-MM-DD');
    var itemSelected = $scope.newReservation.itemIn;
    console.log('getting all reservations for:', currentDateSelected, itemSelected);
    //run the get call if the date has a valid value
    //TODO: prevent get call from running when em value is undefined
    if (currentDateSelected !== "Invalid date" && itemSelected !== undefined) {
      //GET reservations matching selected date and item
      $http({
        method: 'GET',
        url: '/private/reservations/multiple/' + currentDateSelected + '/' + itemSelected,
      }).then(function(response) {
        console.log('getReservations response-->', response.data);
        var unavailablePeriodsArray = makeUnavailablePeriodsArray(response.data.results);
        updatePeriodArrayValues(unavailablePeriodsArray);
        //TODO: show the table
        $scope.tableIsVisible = true;
      }).catch(function(err) {
        //TODO: add better error handling here
        console.log(err);
      }); // end $http
    } else {
      //If either the item or date values are not selected
      //Hide the period selection table
      $scope.tableIsVisible = false;
    }
  }; // end getReservations

  $scope.openDatepick = function() {
    //Open the datepicker popup
    $scope.popup.opened = true;
  }; // end openDatepick

  //Disabled drop down until categories and items are selected
  $scope.changeDropDown = function () {
    if($scope.newReservation.categoryIn === '') {
      $scope.dropDownDisabledItem = true;
      $scope.dropDownDisabledDate = true;
      $scope.dropDownDisabledTeacher = true;
    } else if ($scope.newReservation.itemIn === '') {
      $scope.dropDownDisabledItem = false;
      $scope.dropDownDisabledDate = true;
      $scope.dropDownDisabledTeacher = true;
    } else {
      $scope.dropDownDisabledItem = false;
      $scope.dropDownDisabledDate = false;
      $scope.dropDownDisabledTeacher = false;
    }
  };//end change drop down

  var init = function() {

    $scope.dropDownDisabledItem = true;
    $scope.dropDownDisabledDate = true;
    $scope.dropDownDisabledTeacher = true;

    //set periodArray and selection scopes
    $scope.periodArray = defaultPeriodsArray;
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
      minDate: minDay(),
      maxDate: maxDay(),
      startingDay: 0,
      showWeeks: false
    }; // end dateOptions

    console.log('DATE OPTIONS', $scope.dateOptions);

    $scope.reservationsMade = [];

    getAllItems();

  }; // end init

  var maxDay = function() {
    return moment().add(12, 'weeks');
  }; // end maxDay

  var minDay = function() {
    //Sets the default date picker date.
    //Sets it to monday if the current day is a weekend
    var dayOfWeekToday = moment().isoWeekday();
    var datePickDefault;
    if (dayOfWeekToday > 5) {
      //set the default to the next monday
      var num = 8 - dayOfWeekToday;
      datePickDefault = moment().add(num, 'days');
    } else {
      //set the default to the current day
      datePickDefault = moment();
    } // end else
    $scope.date = datePickDefault._d;
    return datePickDefault._d;
  }; // end today

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

  var makeUnavailablePeriodsArray = function(reservationsArray) {
    var allPeriodsReserved = [];
    reservationsArray.map(function(reservation) {
      //split the period property into an array
      var periodsReserved = reservation.period.split(',');
      //for each period in periodsReserved
      for (var i = 0; i < periodsReserved.length; i++) {
        //push the value into allPeriodsReserved array if it's not already in there
        if (allPeriodsReserved.indexOf(periodsReserved[i]) === -1) {
          allPeriodsReserved.push(periodsReserved[i]);
        } // end if
      } // end for
    }); // end map
    return allPeriodsReserved;
  }; // end makeUnavailablePeriodsArray

  var resetPeriodArray = function() {
    //reset periods array to defaults
    $scope.periodArray = [
      { name: 'BS', reserved: false, class: 'enabled' },
      { name: 'One', reserved: false, class: 'enabled' },
      { name: 'Two', reserved: false, class: 'enabled' },
      { name: 'Three', reserved: false, class: 'enabled' },
      { name: 'Four', reserved: false, class: 'enabled' },
      { name: 'Five', reserved: false, class: 'enabled' },
      { name: 'Six', reserved: false, class: 'enabled' },
      { name: 'Seven', reserved: false, class: 'enabled' },
      { name: 'AS', reserved: false, class: 'enabled' },
    ]; // end periodArray
  }; // end resetPeriodArray

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
    var idx = $scope.selection.indexOf(periodName.name);
    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // Is newly selected
    else {
      $scope.selection.push(periodName.name);
    }
    //update current period selections in newReservation object
    $scope.newReservation.periodIn = $scope.selection;
  }; // end toggleSelection

  var updatePeriodArrayValues = function(unavailablePeriodsArray) {
    unavailablePeriodsArray.map(function(period) {
      //update periodsArray reserved property if value matches
      for (var i = 0; i < $scope.periodArray.length; i++) {
        if ($scope.periodArray[i].name === period) {
          $scope.periodArray[i].reserved = true;
          $scope.periodArray[i].class = 'disabled';
        } // end if
      } // end for
    }); // end unavailablePeriodsArray
  }; // end updatePeriodArrayValues

  //open the modal (returns a modal instance)
  $scope.open = function (size, newReservation) {
    console.log('TeacherName: ', $scope.teacherName);
    if($scope.isAdmin === true){
      $scope.newReservation.username = $scope.teacherName.name;
    }// end if
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

      //Clear/reset the make a reservation form after modal closed
      $scope.resetForm = function () {
        $scope.selection = [];
        $scope.newReservation.periodIn = '';
        $scope.newReservation.dateIn = '';
        //$scope.dateOptions = {};
        $scope.dt = new Date();
        $scope.newReservation.itemIn = '';
        $scope.newReservation.categoryIn = '';
        $scope.dropDownDisabledItem = true;
        $scope.dropDownDisabledDate = true;
        $scope.dropDownDisabledTeacher = true;
        $scope.teacherName.name = '';
      };
      //Hide the table
      $scope.tableIsVisible = false;
      //reset period array values
      resetPeriodArray();
      //if the modal was closed via 'confirm' btn, display reservation confirmation alert
      if (reason.value === 'confirm') {
        //construct reservationMadeObject
        var reservationMadeObject = {
          item: reason.reservation.itemIn,
          date: reason.reservation.dateIn,
          period: reason.reservation.periodIn,
          teacher: reason.reservation.name
        }; // end reservationMadeObject
        //push the reservation made into the $scope.reservationMade array
        $scope.reservationsMade.push(reservationMadeObject);
        $scope.resetForm();
      } // end if
    }); // end modal result
  }; // end open

  init();


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
  $scope.getTeachers();

  $scope.teacherName= {
    name:''
  };

}]); // end ReserveController

// confirmation modal
myApp.controller('ConfirmReservationModalController', ['$scope', '$http', '$uibModalInstance', 'newReservation','AuthFactory',
function ($scope, $http, $uibModalInstance, newReservation, AuthFactory) {
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
