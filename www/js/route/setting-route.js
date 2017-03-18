angular.module('setting.route', ['setting.controller'])
  .config(function ($stateProvider) {
    $stateProvider

      .state('setting', {
        url: '/setting',
        abstract: true,
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
      })

      .state('setting.person', {
        url: '/setting-person',
        views: {
          'settingPersonContent': {
            templateUrl: 'templates/setting-person.html',
            controller: 'settingPersonCtrl'
          }
        }
      })

      .state('setting.system', {
        url: '/setting-system',
        views: {
          'settingSystemContent': {
            templateUrl: 'templates/setting-system.html',
            controller: 'settingSystemCtrl'
          }
        }
      })

      .state('setting.app', {
        url: '/setting-app',
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
        templateUrl: 'templates/setting-app-all.html',
        controller: ''
      })

      .state('settingapp.update', {
        url: '/setting-app-update',
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-update.html',
            controller: ''
          }
        }
      })

      .state('settingapp.feature', {
        url: '/setting-app-feature',
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-feature.html',
            controller: ''
          }
        }
      })

      .state('settingapp.help', {
        url: '/setting-app-help',
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-help.html',
            controller: ''
          }
        }
      })

      .state('settingapp.feedback', {
        url: '/setting-app-feedback',
        views: {
          'settingAppAllContent': {
            templateUrl: 'templates/setting-app-feedback.html',
            controller: 'settingAppFeedbackCtrl'
          }
        }
      });
  });
