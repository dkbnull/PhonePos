angular.module('menu.controller', ['menu.service'])
  .controller('menuCtrl', function ($scope, $state) {
    $scope.menuData = {};

    if (!localStorage.getItem('name')) {
      $scope.menuData.username = '';
    } else {
      $scope.menuData.username = localStorage.getItem('name');
    }

    if (!localStorage.getItem('rank') || localStorage.getItem('rank') == "1") {
      $scope.menuTradeItem = true;
      $scope.menuQueryItem = true;
      $scope.menuReturnsItem = true;
      $scope.menuDayoverItem = true;
      $scope.menuMonthoverItem = false;
      $scope.menuSettingItem = true;
    } else if (localStorage.getItem('rank') == "2") {
      $scope.menuTradeItem = false;
      $scope.menuQueryItem = true;
      $scope.menuReturnsItem = false;
      $scope.menuDayoverItem = false;
      $scope.menuMonthoverItem = true;
      $scope.menuSettingItem = true;
    }

    $scope.logout = function () {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('usercode');
      localStorage.removeItem('name');
      localStorage.removeItem('rank');

      $state.go('pos.login');
    }
  });
