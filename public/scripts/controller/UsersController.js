myApp.controller( 'UsersController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory ){
  console.log( 'in UsersController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('UC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('UC. Admin:', $scope.isAdmin);

  var getUsers = function() {
    console.log('in getUsers');
    //GET all users
    $http({
      method: 'GET',
      url: '/private/users'
    }).then(function(response) {
      $scope.allUsers = response.data.users;
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end getUsers

  var init = function() {
    //If user is not logged in
    if(!$scope.loggedIn) {
      //Reroute them to the login page
      $location.path("/#!/login");
    } // end if
    if (!$scope.isAdmin) {
      //Reroute them to the home page
      $location.path("/home");
    } else {
      //If they are an admin, get User data
      getUsers();
    } // end else
  }; // end init

  $scope.updateUserStatus = function(userId, permissions) {
    console.log('in updateUserStatus', userId, permissions);
    //assemble object to send
    var objectToSend = {
      id: userId,
      permissions: permissions
    }; // end objectToSend
    //Update the permissions status of the user
    $http({
      method: 'PUT',
      url: '/private/users',
      data: objectToSend
    }).then(function(response) {
      console.log(response);
      //update users on the DOM
      getUsers();
    }).catch(function(err) {
      //TODO: add better error handling here
      console.log(err);
    }); // end $http
  }; // end updateUserStatus

  init();

}]); // end UsersController
