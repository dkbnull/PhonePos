angular.module('dayover.controller', ['dayover.service'])
  .controller('dayoverCtrl', function ($scope, dayoverFty, commonFty) {
    $scope.dayoverData = {};

    var date = new Date();
    date = formatDate(date);
    date = date.substring(0, 8);

    $scope.dayoverData.date = date.substring(0, 4) + '-'
      + date.substring(4, 6) + '-'
      + date.substring(6, 8);
    $scope.dayoverData.total = '0.00';

    var promise = dayoverFty.loadDayover(date, localStorage.getItem('username'));
    promise.then(
      function (response) {
        if (response) {
          afterLoadDayover(response);
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
    );

    $scope.dayoverConfirm = function () {
      var data = $scope.dayoverData.dayover;
      var date = $scope.dayoverData.date;
      var total = $scope.dayoverData.total;
      var username = localStorage.getItem('username');

      var promise = dayoverFty.dayover(data, date, total, username);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              commonFty.alertPopup('日结成功');
            } else {
              if (response.msgmain = 'has dayover') {
                commonFty.alertPopup('今天已经日结，无需重复日结');
              } else {
                commonFty.alertPopup('日结失败，请重新日结');
              }
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
        commonFty.alertPopup('日结信息为空');
      }
    }
  });
