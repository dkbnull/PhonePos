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

// .config(function ($urlRouterProvider) {
//   $urlRouterProvider.otherwise('/pos/login');
// });

  .config(function ($urlRouterProvider) {
    if (localStorage.getItem('username') == null) {
      $urlRouterProvider.otherwise('/pos/login');
    }
    else {
      $urlRouterProvider.otherwise('/menu/trade');
    }
  });
