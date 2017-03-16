angular.module('phonepos', ['ionic', 'phonepos.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  // 配置相关布局，如配置导航栏在屏幕下方
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
  })

  // login.html
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('pos', {
        url: '/pos',
        abstract: true,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('pos.login', {
        url: '/login',
        views: {
          'loginContent': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/pos/login');
  })

  // menu.html
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
            controller: 'dayOverCtrl'
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
  })

  // setting.html
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

  // setting-app-all.html
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
            controller: 'feedbackCtrl'
          }
        }
      });
  });

// .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
//   $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//
//   var param = function (obj) {
//     var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
//
//     for (name in obj) {
//       value = obj[name];
//
//       if (value instanceof Array) {
//         for (i = 0; i < value.length; ++i) {
//           subValue = value[i];
//           fullSubName = name + '[' + i + ']';
//           innerObj = {};
//           innerObj[fullSubName] = subValue;
//           query += param(innerObj) + '&';
//         }
//       } else if (value instanceof Object) {
//         for (subName in value) {
//           subValue = value[subName];
//           fullSubName = name + '[' + subName + ']';
//           innerObj = {};
//           innerObj[fullSubName] = subValue;
//           query += param(innerObj) + '&';
//         }
//       } else if (value !== undefined && value !== null) {
//         query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
//       }
//
//       return query.length ? query.substr(0, query.length - 1) : query;
//     }
//
//     $httpProvider.defaults.transformRequest = [function (data) {
//       return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
//     }];
//   }
// });
