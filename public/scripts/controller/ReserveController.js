myApp.controller( 'ReserveController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory ){
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
    $scope.itemNames.push(items[i].newItem)
    if ($scope.categories.indexOf(items[i].category) === -1){
      $scope.categories.push(items[i].category)
    } else {
      console.log('already exists');
    }
  }

  console.log('item names array', $scope.itemNames);


  }); //end http

  $scope.periodArray = ['BS', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'AS'];
  $scope.selection = [];

  var username = authFactory.username



  $scope.newReservation = {
      categoryIn: '',
      itemIn: '',
      dateIn: '',
      periodIn: $scope.selection,
      username: username,
      numberOfStudents: $scope.numberOfStudentsIn,
      roomNumber: $scope.roomNumberIn
    }

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

  $scope.makeReservation = function (){
    console.log('In Make Reservation');

    $http ({
      method: 'POST',
      url: '/private/reservations',
      data: $scope.newReservation,
    }).then(function(response) {
            console.log('response ->', response);
    });

    $http({
    method: 'GET',
    url: '/private/reservations'
}).then(function(response) {
    console.log('response ->', response);
}); //end http

  var item = $scope.newReservation.itemIn;
  var date = $scope.newReservation.dateIn;
  var period = $scope.newReservation.periodIn;
  $scope.roomNumberIn = '';
  $scope.numberOfStudentsIn = '';



  $scope.outputDiv += '<p>' + 'You have added a reservation for ' + item + ' on ' + date + ' for period ' + period + '</p>'

};//end make Reservation

// confirmation modal

//open the modal (returns a modal instance)
$scope.confirmModal = function (size, userId) {
  //open the modal
  console.log('Open confirm reservation modal');
  //set the modalInstance
  var modalInstance = $uibModal.open({
    templateUrl: 'confirmReservationModal.html',
    controller: 'ConfirmReservationModalController',
    size: size,
    //pass the userId to DeleteUserModalController
    resolve: {
      deleteId: function () {
        return userId;
      } // end userId
    } // end resolve
  }); // end modalInstance

  //Update the users when the modal has been closed
  modalInstance.closed.then(function () {
    getUsers();
  }); // end modalInstance closed

}; // end open

init();

}]); // end UsersController

/* DeleteUserModalController is passed $modalInstance
* which is the instance of modal returned by the open() function.
* This instance needs to be passed because dismiss is the property of
* this instance object which is used to close the modal. */

//DeleteUserModalController
myApp.controller('ConfirmReservationModalController', ['$scope', '$http', '$uibModalInstance',
function ($scope, $http, $uibModalInstance) {
  console.log('in ConfirmReservationModalController');

  //close the  modal
  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  }; // end close


} // end controller callback
]); // end ModalInstanceController




}]); // end ReserveController
