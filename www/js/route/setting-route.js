angular.module('setting.route', ['setting.controller'])
  .config(function ($stateProvider) {
    $stateProvider

      .state('setting', {
        url: '/setting',
        abstract: true,
        cache: false,
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
      })

      .state('setting.person', {
        url: '/setting-person',
        cache: false,
        views: {
          'settingPersonContent': {
            templateUrl: 'templates/setting-person.html',
            controller: 'settingPersonCtrl'
          }
        }
      })

      .state('setting.system', {
        url: '/setting-system',
        cache: false,
        views: {
          'settingSystemContent': {
            templateUrl: 'templates/setting-system.html',
            controller: 'settingSystemCtrl'
          }
        }
      })

      .state('setting.app', {
        url: '/setting-app',
        cache: false,
        views: {
          'settingAppContent': {
            templateUrl: 'templates/setting-app.html',
            controller: 'settingAppCtrl'
          }
        }
      });
  })

  .config(function ($stateProvider) {
    $stateProvider

      .state('settingapp', {
        url: 'setting-app-all',
        abstract: true,
        cache: false,
        templateUrl: 'templates/setting-app-all.html',
        controller: ''
      })

      .state('settingapp.update', {
        url: '/setting-app-update',
        cache: false,
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-update.html',
            controller: ''
          }
        }
      })

      .state('settingapp.feature', {
        url: '/setting-app-feature',
        cache: false,
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-feature.html',
            controller: ''
          }
        }
      })

      .state('settingapp.help', {
        url: '/setting-app-help',
        cache: false,
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-help.html',
            controller: ''
          }
        }
      })

      .state('settingapp.feedback', {
        url: '/setting-app-feedback',
        cache: false,
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-feedback.html',
            controller: 'settingAppFeedbackCtrl'
          }
        }
      });
  });
