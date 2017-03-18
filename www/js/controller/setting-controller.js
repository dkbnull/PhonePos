angular.module('setting.controller', ['setting.service'])
  .controller('settingCtrl', function ($scope, $state) {
    //点击取消按钮
    $scope.settingCancel = function () {
      //这里跳转到新界面需刷新，否则会有缓存，导致后续操作出问题
      $state.go('menu.trade');
      location.reload();
    };
  })

  .controller('settingPersonCtrl', function ($scope, $http, $ionicPopup) {
    $scope.settingPersonData = {};

    $scope.settingPersonBtnConfirm = false;
    $scope.settingPersonBtnModify = true;

    // TODO 测试
    username = 'test';

    console.log('getPerson begin:', username);
    $http.post(urlGetPerson, {
      username: username,
      method: 'getPerson'
    }).success(function (response) {
      console.log('getPerson success:', response);
      if (response.msgcode == 1) {
        $scope.settingPersonData.username = username;
        $scope.settingPersonData.usercode = response.msgmain.usercode;
        $scope.settingPersonData.name = response.msgmain.name;
        $scope.settingPersonData.phone = parseInt(response.msgmain.phone);
      } else {
        // 个人设置信息为空
      }
    }).error(function () {
      console.log('getPerson fail:', '网络异常');
      $ionicPopup.alert({
        title: '提示',
        template: '网络异常',
        okText: '确定'
      });
    });

    // 点击修改按钮
    $scope.settingPersonModify = function () {
      $scope.settingPersonBtnModify = false;
      $scope.settingPersonBtnConfirm = true;
    };

    //点击取消按钮
    $scope.settingPersonCancel = function () {
      location.reload();
    };

    // 点击确认按钮
    $scope.settingPerson = function () {
      if ($scope.settingPersonData.name == '' || $scope.settingPersonData.name == null ||
        $scope.settingPersonData.name == undefined || $scope.settingPersonData.phone == '' ||
        $scope.settingPersonData.phone == null || $scope.settingPersonData.phone == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '个人信息不能为空',
          okText: '确定'
        });
        return false;
      }
      if ($scope.settingPersonData.phone.toString().length != 11) {
        $ionicPopup.alert({
          title: '提示',
          template: '手机号码格式错误',
          okText: '确定'
        });
        return false;
      }

      console.log('settingPerson start:', $scope.settingPersonData);
      $http.post(urlSettingPerson, {
        data: $scope.settingPersonData,
        method: 'settingPerson'
      }).success(function (response) {
        console.log('settingPerson success:', response);
        if (response.msgcode == 1) {
          $scope.settingPersonBtnConfirm = false;
          $scope.settingPersonBtnModify = true;
          $ionicPopup.alert({
            title: '提示',
            template: '修改成功',
            okText: '确定'
          });
        } else {
          $ionicPopup.alert({
            title: '提示',
            template: '修改失败，请重试',
            okText: '确定'
          });
        }
      }).error(function () {
        console.log('settingPerson fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      })
    };
  })

  .controller('settingSystemCtrl', function ($scope, $http, $ionicPopup) {
    $scope.settingSystemData = {};

    $scope.settingSystemBtnConfirm = false;
    $scope.settingSystemBtnModify = true;

    // 系统设置是否为空
    var systemSetIsNull = false;

    // TODO 测试
    username = 'test';

    console.log('getSystem begin:', username);
    $http.post(urlGetSystem, {
      username: username,
      method: 'getSystem'
    }).success(function (response) {
      console.log('getSystem success:', response);
      if (response.msgcode == 1) {
        $scope.settingSystemData.orgcode = parseInt(response.msgmain.orgcode);
        $scope.settingSystemData.shopcode = parseInt(response.msgmain.shopcode);
      } else {
        // 系统设置信息为空
        systemSetIsNull = true;
      }
    }).error(function () {
      console.log('getPerson fail:', '网络异常');
      $ionicPopup.alert({
        title: '提示',
        template: '网络异常',
        okText: '确定'
      });
    });

    // 点击修改按钮
    $scope.settingSystemModify = function () {
      $scope.settingSystemBtnModify = false;
      $scope.settingSystemBtnConfirm = true;
    };

    //点击取消按钮
    $scope.settingSystemCancel = function () {
      location.reload();
    };

    // 点击确认按钮
    $scope.settingSystem = function () {
      if ($scope.settingSystemData.orgcode == '' || $scope.settingSystemData.orgcode == null ||
        $scope.settingSystemData.orgcode == undefined || $scope.settingSystemData.shopcode == '' ||
        $scope.settingSystemData.shopcode == null || $scope.settingSystemData.shopcode == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '系统信息不能为空',
          okText: '确定'
        });
        return false;
      }
      if ($scope.settingSystemData.orgcode.toString().length != 6 ||
        $scope.settingSystemData.shopcode.toString().length != 6) {
        $ionicPopup.alert({
          title: '提示',
          template: '请输入6位组织代码',
          okText: '确定'
        });
        return false;
      }

      console.log('settingSystem start:', $scope.settingSystemData);
      $http.post(urlSettingSystem, {
        data: $scope.settingSystemData,
        username: username,
        systemNull: systemSetIsNull,
        method: 'settingSystem'
      }).success(function (response) {
        console.log('settingSystem success:', response);
        if (response.msgcode == 1) {
          $scope.settingSystemBtnConfirm = false;
          $scope.settingSystemBtnModify = true;
          $ionicPopup.alert({
            title: '提示',
            template: '修改成功',
            okText: '确定'
          });
        } else {
          // alert(response.msgmain);
          $ionicPopup.alert({
            title: '提示',
            template: response.msgmain,
            okText: '确定'
          });
        }
      }).error(function () {
        console.log('settingSystem fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      })
    };
  })

  .controller('settingAppCtrl', function ($scope) {
  })

  .controller('settingAppFeedbackCtrl', function ($scope, $http, $ionicPopup) {
    $scope.feedbackData = {};

    // TODO 测试
    username = 'test';

    // 点击提交按钮
    $scope.feedback = function () {
      if ($scope.feedbackData.problem == '' || $scope.feedbackData.problem == null ||
        $scope.feedbackData.problem == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '反馈信息不能为空',
          okText: '确定'
        });
        return false;
      }
      if (!($scope.feedbackData.phone == '' || $scope.feedbackData.phone == null
        || $scope.feedbackData.phone == undefined) &&
        $scope.feedbackData.phone.toString().length != 11) {
        $ionicPopup.alert({
          title: '提示',
          template: '手机号码格式错误',
          okText: '确定'
        });
        return false;
      }

      console.log('feedback start:', $scope.feedbackData);
      $http.post(urlFeedback, {
        data: $scope.feedbackData,
        username: username,
        method: 'feedback'
      }).success(function (response) {
        console.log('feedback success:', response);
        if (response.msgcode == 1) {
          $ionicPopup.alert({
            title: '提示',
            template: '反馈成功',
            okText: '确定'
          });
          $scope.feedbackData.problem = '';
          $scope.feedbackData.phone = '';
          // location.reload();
        } else {
          // alert(response.msgmain);
          $ionicPopup.alert({
            title: '提示',
            template: response.msgmain,
            okText: '确定'
          });
        }
      }).error(function () {
        console.log('feedback fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      })
    };
  });
