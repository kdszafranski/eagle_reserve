//Set Log Status
var verbose = false;

//Declare app
var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.select','ngSanitize']);

//Config
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '../views/partials/login.html',
      controller: 'AuthController',
    })
    .when('/home', {
      templateUrl: '../views/partials/home.html',
      controller: 'HomeController'
    })
    .when('/manage', {
      templateUrl: '../views/partials/manage.html',
      controller: 'ManageController'
    })
    .when('/reserve', {
      templateUrl: '../views/partials/reserve.html',
      controller: 'ReserveController'
    })
    .when('/users', {
      templateUrl: '../views/partials/users.html',
      controller: 'UsersController'
    })
    .when('/items', {
      templateUrl: '../views/partials/items.html',
      controller: 'ItemsController'
    })
    .otherwise({
      redirectTo: 'login'
    }); // end $routeProvider
}]); // end config
