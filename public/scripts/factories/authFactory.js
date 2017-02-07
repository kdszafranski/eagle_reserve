myApp.factory('AuthFactory', function ($http) {
  console.log('in auth factory');

  var Status = {
    loggedIn: false,
    admin: false
  };

  // the public API
  return {
    Status: Status,

    checkLoggedIn: function () {
      return Status.loggedIn;
    },

    checkAdmin: function() {
      return Status.admin;
    },

    setAdmin: function(value) {
      Status.admin = value;
    },

    isLoggedIn: function () {
      return $http.get('/auth');
    },

    setLoggedIn: function (value) {
      Status.loggedIn = value;
    },

    logout: function () {
      return $http.get('/auth/logout');
    },
  };

  var factory = {};
    factory.username;
    factory.currentUserId = undefined;

  return factory

});
