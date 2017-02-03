myApp.controller( 'ItemsController', [ '$scope', '$http', '$window', function( $scope, $http, $window ){
  console.log( 'in ItemsController' );

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
  }; // end addItem 


}]); // end ItemsController
