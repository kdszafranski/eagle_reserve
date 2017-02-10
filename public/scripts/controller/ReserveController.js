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

  $http({
  method: 'GET',
  url: '/private/items'
  }).then(function(response) {
  console.log('response for items ->', response);
  var items = response.data.results;
  $scope.itemNames = [];
  $scope.categories = [];

  console.log('items', items);

  for (var i = 0; i < items.length; i++) {
    $scope.itemNames.push(items[i].newItem);
    if ($scope.categories.indexOf(items[i].category) === -1){
      $scope.categories.push(items[i].category);
    } else {
      console.log('already exists');
    }
  }

  console.log('item names array', $scope.itemNames);


  }); //end http

  $scope.periodArray = ['BS', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'AS'];
  $scope.selection = [];

  var username = authFactory.username;



  $scope.newReservation = {
      categoryIn: '',
      itemIn: '',
      dateIn: '',
      periodIn: $scope.selection,
      username: username,
      numberOfStudents: $scope.numberOfStudentsIn,
      roomNumber: $scope.roomNumberIn
    };

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
    } // en
  }); // end modalInstance
  modalInstance.closed.then(function(){
  var item = $scope.newReservation.itemIn;
  var date = $scope.newReservation.dateIn;
  var period = $scope.newReservation.periodIn;
  $scope.roomNumberIn = '';
  $scope.numberOfStudentsIn = '';



  $scope.outputDiv += '<p>' + 'You have added a reservation for ' + item + ' on ' + date + ' for period ' + period + '</p>';
});
}; // end open

}]); // end ReserveController

// confirmation modal

myApp.controller('ConfirmReservationModalController', ['$scope', '$http', '$uibModalInstance', 'newReservation',
function ($scope, $http, $uibModalInstance, newReservation) {
    console.log('in ConfirmReservationModalController');
    console.log(newReservation);

    $scope.makeReservation = function (){
      console.log('In Make Reservation');

      $http ({
        method: 'POST',
        url: '/private/reservations',
        data: newReservation,
      }).then(function(response) {
              console.log('response ->', response);
              $scope.sendEmail();
              $scope.close();

      });

      $http({
      method: 'GET',
      url: '/private/reservations'
  }).then(function(response) {
      console.log('response ->', response);
  }); //end http



  };//end make Reservation

  // send email
  $scope.sendEmail = function( req, res ) {
      //post info to the server
      $http({
        method: 'POST',
        url: '/private/email'
      }).then(function(response) {
        console.log('EMAIL SENT');


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
