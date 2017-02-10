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
      username: username
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


  $scope.outputDiv += '<p>' + 'You have added a reservation for ' + item + ' on ' + date + ' for period ' + period + '</p>'

};//end make Reservation

// send email
$scope.sendEmail = function( req, res ) {
    console.log('in sendEmail');
    // console.log(req.user.email);
    var myEmail = 'avhs.test1@apps.district196.org';
    var yourEmail = 'avhs.test1@apps.district196.org';
    //construct object to send
    var objectToSend = {
      from: myEmail,
      to: yourEmail,
      subject: 'Reservation Confirmation',
      text: 'You reserved item on day during period'
    }; // end objectToSend
    //post info to the server
    console.log('pre http call');
    $http({
      method: 'POST',
      url: '/private/email',
      data: objectToSend
    }).then(function(response) {
      console.log('EMAIL SENT');
      console.log('send email response!!!-->',response.data);
    }).catch(function(err) {
      //if there was an error, log it
      console.log(err);
    }); // end $http
  }; // end sendEmails



}]); // end ReserveController
