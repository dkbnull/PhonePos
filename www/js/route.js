/**
 * 总路由模块
 */
angular.module('route', [
  'login.route',
  'menu.route',
  'trade.route',
  'query.route',
  'returns.route',
  'dayover.route',
  'setting.route'
])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/pos/login');
  });

// .config(function ($stateProvider, $urlRouterProvider) {
//   // 第一次登陆
//   if (localStorage["isFirst"]) {
//     $urlRouterProvider.otherwise('/pos/login');
//   }
//   else {
//     $urlRouterProvider.otherwise('/guidePage');
//   }
// });
