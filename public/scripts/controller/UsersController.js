myApp.controller( 'UsersController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal ){
  if (verbose) console.log( 'in UsersController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  if (verbose) console.log('UC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  if (verbose) console.log('UC. Admin:', $scope.isAdmin);

  //Filter by date set to default
  $scope.sortType = 'lastName';

  var addSplitUsernames = function(userArray) {
    if (verbose) console.log('addSplitUsernames');
    userArray.map(function(user) {
      user.firstName = user.name.split(' ')[0];
      user.lastName = user.name.split(' ')[1];
    }); // end map
    return userArray;
  }; // end addSplitUsernames

  var getUsers = function() {
    if (verbose) console.log('in getUsers');
    //GET all users
    $http({
      method: 'GET',
      url: '/private/users'
    }).then(function(response) {
      if (verbose) console.log('THIS-->',addSplitUsernames(response.data.users));
      $scope.allUsers = addSplitUsernames(response.data.users);
    }).catch(function(err) {
      //TODO: add better error handling here
      if (verbose) console.log(err);
    }); // end $http
  }; // end getUsers

  var init = function() {
    //If user is not logged in
    if(!$scope.loggedIn) {
      //Reroute them to the login page
      $location.path("/#!/login");
    } // end if
    //If user is not an Admin
    if (!$scope.isAdmin) {
      //Reroute them to the home page
      $location.path("/home");
    } else {
      //If they are an admin, get User data
      getUsers();
      initializeFilterSelect();
    } // end else
  }; // end init

  var initializeFilterSelect = function() {
    //set statusArray for status select
    $scope.statusArray = [
      {value: true,
      display: 'Admin'},
      {value: false,
      display: 'Teacher'}
    ]; // end statusArray
    //Initiate status filter to 'off'
    $scope.statusSelected = { value: undefined };
  }; // end initializeSelects

  $scope.controlSaveButtonDisplay = function(userId, permissions) {
    if (verbose) console.log('in controlSaveButtonDisplay. Changed to:', permissions);
    //If select value was changed to Teacher or Amin
    if (permissions !== '') {
      //Shows the save button
      if (verbose) console.log('permissions not equal to blank');
      $scope.changingPermission = userId;
    //If clear value selected
    } else {
      //Hide the display button
      $scope.changingPermission = '';
    } // end else
  }; // end updating

  $scope.showEditSelect = function(userId) {
    if (verbose) console.log('in showEditSelect', userId);
    $scope.isEditing = userId;
  }; // end showEditSelect

  $scope.updateUserStatus = function(userId, permissions) {
    if (verbose) console.log('in updateUserStatus', userId, permissions);
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
      if (verbose) console.log(response);
      //update users on the DOM
      getUsers();
      $scope.changingPermission = '';
      $scope.isEditing = '';
    }).catch(function(err) {
      //TODO: add better error handling here
      if (verbose) console.log(err);
    }); // end $http
  }; // end updateUserStatus

  //open the modal (returns a modal instance)
  $scope.open = function (size, userId) {
    //open the modal
    if (verbose) console.log('Open User delete Confirm modal');
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: 'deleteConfirmModal.html',
      controller: 'DeleteUserModalController',
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
myApp.controller('DeleteUserModalController', ['$scope', '$http', '$uibModalInstance', 'deleteId',
function ($scope, $http, $uibModalInstance, deleteId) {
    if (verbose) console.log('in DeleteUserModalController');

    //close the  modal
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    }; // end close

    $scope.deleteUser = function(userId) {
      if (verbose) console.log('in deleteUser', deleteId);
      //Delete user with this ID
      $http({
        method: 'DELETE',
        url: '/private/users/' + deleteId
      }).then(function(response) {
        if (verbose) console.log(response);
        //close the modal
        $uibModalInstance.close();
      }).catch(function(err) {
        //TODO: add better error handling here
        if (verbose) console.log(err);
      }); // end $http
    }; // end deleteUser

  } // end controller callback
]); // end ModalInstanceController
