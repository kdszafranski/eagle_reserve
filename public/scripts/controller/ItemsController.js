myApp.controller( 'ItemsController', [ '$scope', '$http', '$location', 'AuthFactory', '$uibModal',
function( $scope, $http, $location, AuthFactory, $uibModal ){
  console.log( 'in ItemsController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('IC. Logged in:', $scope.loggedIn);
  //check permissions
  $scope.isAdmin = authFactory.checkAdmin();
  console.log('IC. Admin:', $scope.isAdmin);
  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } // end if
  //If user is not an admin, reroute them to the home page
  if (!$scope.isAdmin) {
    //Reroute them to the home page
    $location.path("/home");
  } // end if

  //Initialize scope variables
  //as child scopes (because they are within ng-if)
  $scope.newItem = {
    name: '',
    category: ''
  }; // end $scope.newItem

  //set statusArray for status select
  $scope.categoryArray = [
    {value: 'Cart'},
    {value: 'Lab'},
    {value: 'Equipment'}
  ]; // end statusArray
  //Initiate status filter to 'off'
  $scope.categorySelected = { value: undefined };

  // GET all items to display on DOM
  $scope.displayItems = function(){
    console.log( 'in displayItem' );
    $http.get( '/private/items' )
    .then(function( response ){
      $scope.allItems = response.data.results;
    }); // end $http
  }; // end displayItems

  // delete item
  $scope.deleteItem = function( indexIn ){
    $http.delete( '/private/items/' + $scope.allItems[ indexIn ]._id )
    .then(function( response ){
      console.log( 'delete hit', response );
      $scope.displayItems();
    }); // end $http
  }; // end deleteItem

  //open the modal (returns a modal instance)
  $scope.openAddItemModal = function (size) {
    //open the modal
    console.log('Open User delete Confirm modal');
    //set the modalInstance
    var modalInstance = $uibModal.open({
      templateUrl: 'addNewItemModal.html',
      controller: 'AddNewItemModalController',
      size: size
    }); // end modalInstance

    //Update the users when the modal has been closed
    modalInstance.closed.then(function () {
      $scope.displayItems();
      //reset scope variables
      $scope.newItem.name = '';
      $scope.newItem.category = '';
    }); // end modalInstance closed

  }; // end openAddItemModal

  $scope.displayItems();

}]); // end ItemsController

/* AddNewItemModalController is passed $modalInstance
 * which is the instance of modal returned by the open() function.
 * This instance needs to be passed because dismiss is the property of
 * this instance object which is used to close the modal. */

//AddNewItemModalController
myApp.controller('AddNewItemModalController', ['$scope', '$http', '$uibModalInstance',
function ($scope, $http, $uibModalInstance) {
    console.log('in AddNewItemModalController');

    //close the  modal
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    }; // end close

    $scope.addItem = function(){
      var itemToSend = {
        newItem: $scope.newItem.name,
        category: $scope.newItem.category
      }; // end itemToSend
      $http({
        method: 'POST',
        url: '/private/items',
        data: itemToSend
      }).then(function successCallback( response ){
        console.log( 'response in newItem', response );
        //close the modal
        $scope.close();
      }, function errorCallback( error ){
        console.log( 'error occured' );
      }); // end errorCallback
    }; // end addItem

  } // end controller callback
]); // end AddNewItemModalController
