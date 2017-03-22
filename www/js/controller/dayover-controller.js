angular.module('dayover.controller', ['dayover.service'])
  .controller('dayoverCtrl', function ($scope, $http, $ionicPopup) {
    $scope.dayoverData = {};

    var date = new Date();
    date = formatDate(date);
    date = date.substring(0, 8);

    $scope.dayoverData.date = date.substring(0, 4) + '-'
      + date.substring(4, 6) + '-'
      + date.substring(6, 8);
    $scope.dayoverData.total = '0.00';

    console.log('load dayover start', date);
    $http.post(urlDayover, {
      data: date,
      username: localStorage.getItem('username'),
      method: 'loadDayover'
    }).success(function (response) {
      console.log('load dayover success:', response);
      afterLoadDayover(response);
    }).error(function () {
      console.log('load dayover fail:', '网络异常');
      $ionicPopup.alert({
        title: '提示',
        template: '网络异常',
        okText: '确定'
      });
    });

    $scope.dayoverConfirm = function () {
      console.log('dayover start', date);
      $http.post(urlDayover, {
        data: $scope.dayoverData.dayover,
        date: $scope.dayoverData.date,
        total: $scope.dayoverData.total,
        username: localStorage.getItem('username'),
        method: 'dayover'
      }).success(function (response) {
        console.log('dayover success:', response);
        if (response.msgcode == 1) {
          $ionicPopup.alert({
            title: '提示',
            template: '日结成功',
            okText: '确定'
          });
        } else {
          if (response.msgmain = 'has dayover') {
            $ionicPopup.alert({
              title: '提示',
              template: '今天已经日结，无需重复日结',
              okText: '确定'
            });
          } else {
            $ionicPopup.alert({
              title: '提示',
              template: '日结失败，请重新日结',
              okText: '确定'
            });
          }
        }
      }).error(function () {
        console.log('dayover fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    };

    /**
     * 加载日结信息成功后相关操作
     *
     * @param response 加载日结信息成功后返回信息
     */
    function afterLoadDayover(response) {
      if (response.msgcode == 1) {
        var total = 0;

        $scope.dayoverData.dayover = response.msgmain;

        for (var i = 0; i < $scope.dayoverData.dayover.length; i++) {
          total += parseInt($scope.dayoverData.dayover[i]['paytotal']);
        }

        $scope.dayoverData.total = total.toFixed(2);
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '日结信息为空',
          okText: '确定'
        });
      }
    }
  });
