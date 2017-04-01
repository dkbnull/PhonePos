angular.module('setting.controller', ['setting.service'])
  .controller('settingCtrl', function ($scope, $state) {
    //点击取消按钮
    $scope.settingCancel = function () {
      $state.go('menu.trade');
      // location.reload();
    };
  })

  .controller('settingPersonCtrl', function ($scope, settingPersonFty, commonFty) {
    $scope.settingPersonData = {};

    $scope.settingPersonBtnConfirm = false;
    $scope.settingPersonBtnModify = true;

    loadPerson();

    // 点击修改按钮
    $scope.settingPersonModify = function () {
      $scope.settingPersonBtnModify = false;
      $scope.settingPersonBtnConfirm = true;
    };

    //点击取消按钮
    $scope.settingPersonCancel = function () {
      $scope.settingPersonBtnModify = true;
      $scope.settingPersonBtnConfirm = false;

      loadPerson();
    };

    // 点击确认按钮
    $scope.settingPerson = function () {
      if (!$scope.settingPersonData.name || !$scope.settingPersonData.phone) {
        commonFty.alertPopup('姓名和手机不能为空');
        return false;
      }
      if ($scope.settingPersonData.phone.toString().length != 11) {
        commonFty.alertPopup('手机号码格式错误');
        return false;
      }

      var promise = settingPersonFty.settingPerson($scope.settingPersonData);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              $scope.settingPersonBtnConfirm = false;
              $scope.settingPersonBtnModify = true;

              localStorage.setItem('name', $scope.settingPersonData.name);

              commonFty.alertPopup('修改成功');
            } else {
              commonFty.alertPopup('修改失败，请重试');
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
     * 加载个人信息
     */
    function loadPerson() {
      var promise = settingPersonFty.getPerson(localStorage.getItem('username'));
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              $scope.settingPersonData.username = localStorage.getItem('username');
              $scope.settingPersonData.usercode = response.msgmain.usercode;
              $scope.settingPersonData.name = response.msgmain.name;
              $scope.settingPersonData.phone = parseInt(response.msgmain.phone);
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
    }
  })

  .controller('settingSystemCtrl', function ($scope, settingSystemFty, commonFty) {
    $scope.settingSystemData = {};

    $scope.settingSystemBtnConfirm = false;
    $scope.settingSystemBtnModify = true;

    // 系统设置是否为空
    var systemSetIsNull = false;

    loadSystem();

    // 点击修改按钮
    $scope.settingSystemModify = function () {
      $scope.settingSystemBtnModify = false;
      $scope.settingSystemBtnConfirm = true;
    };

    //点击取消按钮
    $scope.settingSystemCancel = function () {
      $scope.settingSystemBtnModify = true;
      $scope.settingSystemBtnConfirm = false;

      loadSystem();
    };

    // 点击确认按钮
    $scope.settingSystem = function () {
      if (!$scope.settingSystemData.orgcode || !$scope.settingSystemData.shopcode) {
        commonFty.alertPopup('系统信息不能为空');
        return false;
      }
      if ($scope.settingSystemData.orgcode.toString().length != 6 ||
        $scope.settingSystemData.shopcode.toString().length != 6) {
        commonFty.alertPopup('请输入6位组织代码');
        return false;
      }

      var data = $scope.settingSystemData;
      var username = localStorage.getItem('username');

      var promise = settingSystemFty.settingSystem(data, username, systemSetIsNull);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              $scope.settingSystemBtnConfirm = false;
              $scope.settingSystemBtnModify = true;
              commonFty.alertPopup('修改成功');
            } else {
              commonFty.alertPopup(response.msgmain);
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
     * 加载系统信息
     */
    function loadSystem() {
      var promise = settingSystemFty.getSystem(localStorage.getItem('username'));
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              $scope.settingSystemData.orgcode = parseInt(response.msgmain.orgcode);
              $scope.settingSystemData.shopcode = parseInt(response.msgmain.shopcode);
            } else {
              // 系统设置信息为空
              systemSetIsNull = true;
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
    }
  })

  .controller('settingAppCtrl', function ($scope) {
  })

  .controller('settingAppFeedbackCtrl', function ($scope, settingAppFeedbackFty, commonFty) {
    $scope.feedbackData = {};

    // 点击提交按钮
    $scope.feedback = function () {
      if (!$scope.feedbackData.problem) {
        commonFty.alertPopup('反馈信息不能为空');
        return false;
      }
      if ($scope.feedbackData.phone &&
        $scope.feedbackData.phone.toString().length != 11) {
        commonFty.alertPopup('手机号码格式错误');
        return false;
      }

      var promise = settingAppFeedbackFty.feedback($scope.feedbackData, localStorage.getItem('username'));
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              commonFty.alertPopup('反馈成功');

              $scope.feedbackData.problem = '';
              $scope.feedbackData.phone = '';
            } else {
              commonFty.alertPopup(response.msgmain);
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
