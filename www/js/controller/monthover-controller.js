angular.module('monthover.controller', ['monthover.service'])
  .controller('monthoverCtrl', function ($scope, monthoverFty, commonFty) {
    $scope.monthoverData = {};

    var date = new Date();
    date = formatDate(date);
    date = date.substring(0, 6);

    $scope.monthoverData.date = date.substring(0, 4) + '-'
      + date.substring(4, 6);
    $scope.monthoverData.total = '0.00';

    var promise = monthoverFty.loadMonthover(date, localStorage.getItem('username'));
    promise.then(
      function (response) {
        if (response) {
          afterLoadMonthover(response);
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

    $scope.monthoverConfirm = function () {
      var data = $scope.monthoverData.monthover;
      var date = $scope.monthoverData.date;
      var total = $scope.monthoverData.total;
      var username = localStorage.getItem('username');

      var promise = monthoverFty.monthover(data, date, total, username);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              commonFty.alertPopup('月结成功');
            } else {
              if (response.msgmain = 'has monthover') {
                commonFty.alertPopup('本月已经月结，无需重复月结');
              } else {
                commonFty.alertPopup('月结失败，请重新月结');
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
     * 加载月结信息成功后相关操作
     *
     * @param response 加载月结信息成功后返回信息
     */
    function afterLoadMonthover(response) {
      if (response.msgcode == 1) {
        var total = 0;

        $scope.monthoverData.monthover = response.msgmain;

        for (var i = 0; i < $scope.monthoverData.monthover.length; i++) {
          total += parseInt($scope.monthoverData.monthover[i]['paytotal']);
        }

        $scope.monthoverData.total = total.toFixed(2);
      } else {
        commonFty.alertPopup('月结信息为空');
      }
    }
  });
