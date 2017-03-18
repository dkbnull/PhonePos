/**
 * 配置模块，配置不同平台的兼容性
 */
angular.module('config', [])

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
