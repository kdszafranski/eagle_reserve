myApp.controller( 'ItemsController', [ '$scope', '$http', '$location', 'AuthFactory',
function( $scope, $http, $location, AuthFactory ){
  console.log( 'in ItemsController' );

  //Declare authFactory
  var authFactory = AuthFactory;
  //On view load, check if the user is logged in
  $scope.loggedIn = authFactory.checkLoggedIn();
  console.log('IC. Logged in:', $scope.loggedIn);
  //If user is not logged in
  if(!$scope.loggedIn) {
    //Reroute them to the login page
    $location.path("/#!/login");
  } // end if

  $scope.addItem = function(){
    var newItem = {
      newItem: $scope.newItem,
      category: $scope.categorySelect
    };
    $http({
      method: 'POST',
      url: '/newItem',
      data: newItem
    }).then(function successCallback( response ){
      console.log( 'response in newItem', response );
    }, function errorCallback( error ){
      console.log( 'error occured' );
    });
    $scope.newItem = '';
    $scope.categorySelect = '';

  }; // end addItem


}]); // end ItemsController
