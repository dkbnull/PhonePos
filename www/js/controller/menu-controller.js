angular.module('menu.controller', ['menu.service'])
  .controller('menuCtrl', function ($scope, $state) {
    $scope.menuData = {};

    if (localStorage.getItem('name') == '' || localStorage.getItem('name') == null ||
      localStorage.getItem('name') == undefined) {
      $scope.menuData.username = '';
    } else {
      $scope.menuData.username = localStorage.getItem('name');
    }

    $scope.logout = function () {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('usercode');
      localStorage.removeItem('name');

      $state.go('pos.login');
    }
  });
