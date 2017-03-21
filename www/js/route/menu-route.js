angular.module('menu.route', ['menu.controller'])
  .config(function ($stateProvider) {
    $stateProvider

      .state('menu', {
        url: '/menu',
        abstract: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('menu.trade', {
        url: '/trade',
        views: {
          'menuContent': {
            templateUrl: 'templates/trade.html',
            controller: 'tradeCtrl'
          }
        }
      })

      .state('menu.query', {
        url: '/query',
        views: {
          'menuContent': {
            templateUrl: 'templates/query.html',
            controller: 'queryCtrl'
          }
        }
      })

      .state('menu.returns', {
        url: '/returns',
        views: {
          'menuContent': {
            templateUrl: 'templates/returns.html',
            controller: 'returnsCtrl'
          }
        }
      })

      .state('menu.dayover', {
        url: '/dayover',
        views: {
          'menuContent': {
            templateUrl: 'templates/dayover.html',
            controller: 'dayoverCtrl'
          }
        }
      })

      .state('menu.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html',
            controller: 'settingCtrl'
          }
        }
      });
  });
