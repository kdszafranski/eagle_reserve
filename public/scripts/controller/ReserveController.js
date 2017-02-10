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

  //GET all items from the database
  $http({
    method: 'GET',
    url: '/private/items'
  }).then(function(response) {
    console.log('response for items ->', response);
    $scope.items = response.data.results;
    $scope.categories = $scope.items.map (function (x){
      return x.category;
    }); // end callback
  }); //end http

  //set periodArray and selection scopes
  $scope.periodArray = ['BS', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'AS'];
  $scope.selection = [];

  //pull the username in from authFactory and store as variable
  var username = authFactory.username;

  $scope.testme = function() {
    console.log($scope.newReservation.itemIn);
  }; // end testme

  $scope.newReservation = {
    categoryIn: '',
    itemIn: '',
    dateIn: '',
    periodIn: $scope.selection,
    username: username,
    numberOfStudents: $scope.numberOfStudentsIn,
    roomNumber: $scope.roomNumberIn
  }; // end newReservation

  $scope.toggleSelection = function toggleSelection(periodName) {
    var idx = $scope.selection.indexOf(periodName);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selection.push(periodName);
    }
  };

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
