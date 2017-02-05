myApp.controller('NavController', ['AuthFactory', '$window', '$scope', function(AuthFactory, $window, $scope) {
  console.log('in NavController');

    //control ui.bootstrap.collapse
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    var authFactory = AuthFactory;
    $scope.displayLogout = false; // controls display of logout options on DOM

    //Controls display of a helpful message on the DOM when errors occur
    $scope.message = {
      text: false,
      type: 'info'
    }; // end message

    //collapse navbar when view is changed on mobile
    $scope.collapseNav = function() {
      $scope.isNavCollapsed = true;
    }; // end collapseNav

    authFactory.isLoggedIn()
    .then(function(response) { // success
      if (response.data.status) {
        $scope.displayLogout = true;
        authFactory.setLoggedIn(true);
        $scope.username = response.data.name;
        //Scope the admin status
        $scope.isAdmin = response.data.admin;
        //Set admin status in authFactory
        authFactory.setAdmin($scope.isAdmin);
      } else { // is not logged in on server
        $scope.displayLogout = false;
        authFactory.setLoggedIn(false);
      } // end else
    }, // end then
    function() { //error
      //TODO: add better error handling here
      $scope.message.text = 'Unable to properly authenticate user';
      $scope.message.type = 'error';
    }); // end isLoggedIn

    $scope.logout = function() {
      authFactory.logout()
        .then(function(response) { // success
          console.log('user has been logged out.');
          authFactory.setLoggedIn(false);
          $scope.username = '';
          //Hide logout button
          $scope.displayLogout = false;
        }, // end then
      function(response) { // error
        //TODO: add better error handling here
        $scope.message.text = 'Unable to logout';
        $scope.message.type = 'error';
      }); // end callback
    }; // end logout

}]); // end NavController
