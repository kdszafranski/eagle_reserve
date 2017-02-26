myApp.controller('NavController', ['AuthFactory', '$window', '$scope', function(AuthFactory, $window, $scope) {
  if (verbose) console.log('in NavController');

    $scope.behaviors = {
      isNavCollapsed: true,
    }; // end $scope.behaviors

    //control ui.bootstrap.collapse
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    var authFactory = AuthFactory;
    $scope.displayLogout = false; // controls display of logout options on DOM

    //Controls display of a helpful message on the DOM when errors occur
    $scope.message = {
      text: false,
      type: 'info'
    }; // end message

    authFactory.isLoggedIn()
    .then(function(response) { // success
      if (response.data.status) {
        $scope.displayLogout = true;
        authFactory.setLoggedIn(true);
        //Set Username in AuthFactory
        $scope.username = response.data.name;
        authFactory.username = response.data.name;
        //Set current userID in authFactory
        authFactory.currentUserId = response.data.id;
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
          if (verbose) console.log('user has been logged out.');
          authFactory.setLoggedIn(false);
          $scope.username = '';
          // forces a page reload which updates NavController
          $window.location.href = '/';
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
