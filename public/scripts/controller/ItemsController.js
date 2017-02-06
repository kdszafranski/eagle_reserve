myApp.controller( 'ItemsController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory ){
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
      //reset scope variables
      $scope.newItem.name = '';
      $scope.newItem.category = '';
    }, function errorCallback( error ){
      console.log( 'error occured' );
    });

  }; // end addItem

  // GET to display on DOM
  $scope.displayItem = function(){
    console.log( 'in displayItem' );
    $http.get( '/private/items' )
    .then(function( response ){
      console.log( response.data.results );
      $scope.allItems = response.data.results;
      console.log($scope.allItems);
    });
  };
  $scope.displayItem();
}]); // end ItemsController
