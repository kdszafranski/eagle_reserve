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

  $scope.periodArray = ['BS', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'AS'];
  $scope.selection = [];


  $scope.newReservation = {
      categoryIn: '',
      itemIn: '',
      dateIn: '',
      periodIn: $scope.selection
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

};//end make Reservation



}]); // end ReserveController
