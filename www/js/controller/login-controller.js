angular.module('login.controller', ['login.service'])
  .controller('loginCtrl', function ($scope, $http, $state, $ionicPopup) {
    $scope.loginData = {};

    // 登录操作
    $scope.login = function () {
      if ($scope.loginData.username == '' || $scope.loginData.username == null ||
        $scope.loginData.username == undefined || $scope.loginData.password == '' ||
        $scope.loginData.password == null || $scope.loginData.password == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '用户名和密码不能为空',
          okText: '确定'
        });
        return false;
      }

      console.log('login start:', $scope.loginData);
      $http.post(urlLogin, {
        data: $scope.loginData,
        method: 'login'
      }).success(function (response) {
        console.log('login success:', response);
        if (response.msgcode == 1) {
          localStorage.setItem('username', $scope.loginData.username);
          localStorage.setItem('password', $scope.loginData.password);
          localStorage.setItem('usercode', response.msgmain.usercode);
          localStorage.setItem('name', response.msgmain.name);
          $state.go('menu.trade');
          // location.href = '#/menu/trade';
        } else {
          $ionicPopup.alert({
            title: '提示',
            template: '用户名或密码错误',
            okText: '确定'
          });
        }
      }).error(function () {
        console.log('login fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      })
    };
  });
