angular.module('menu.controller', ['menu.service'])
  .controller('menuCtrl', function ($scope, $state) {

    $scope.logout = function () {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('usercode');

      $state.go('pos.login');
    }
  });
