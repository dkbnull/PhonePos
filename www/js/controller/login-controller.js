angular.module('login.controller', ['login.service', 'common.service'])
  .controller('loginCtrl', function ($scope, $state, loginFty, commonFty) {
    $scope.loginData = {};

    $scope.login = function () {
      if (!$scope.loginData.username || !$scope.loginData.password) {
        commonFty.alertPopup('用户名和密码不能为空');
        return false;
      }

      var promise = loginFty.login($scope.loginData);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              localStorage.setItem('username', $scope.loginData.username);
              localStorage.setItem('password', $scope.loginData.password);
              localStorage.setItem('usercode', response.msgmain.usercode);
              localStorage.setItem('name', response.msgmain.name);
              $state.go('menu.trade');
              // location.href = '#/menu/trade';
            } else {
              commonFty.alertPopup('用户名或密码错误');
            }
          }
          else {
            commonFty.alertPopup('未知错误');
          }
        },
        function (response) {
          if (response) {
            commonFty.alertPopup(response);
          } else {
            commonFty.alertPopup('网络异常');
          }
        }
      )
    };
  });
