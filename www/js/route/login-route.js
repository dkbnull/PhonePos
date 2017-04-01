angular.module('login.route', ['login.controller'])
  .config(function ($stateProvider) {
    $stateProvider

      .state('pos', {
        url: '/pos',
        abstract: true,
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('pos.login', {
        url: '/login',
        cache: false,
        views: {
          'loginContent': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      });
  });
