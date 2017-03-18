angular.module('returns.controller', ['returns.service'])
  .controller('returnsCtrl', function ($scope, $http, $ionicModal, $ionicPopup) {
    $scope.returnsData = {};

    $ionicModal.fromTemplateUrl('templates/returns-pay.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.returnsBlank = true;
    $scope.returnsOrder = false;

    // TODO 测试
    username = 'test';
    usercode = '1234';

    // 订单流水号
    var order;
    // 订单合计
    var total = 0;
    // 已退，未退
    var hasPay = 0, noPay = 0;
    // 已使用的退款方式
    var pay = '';
    // 会员卡面号
    var cardfaceno = '';

    // 点击退货按钮
    $scope.returnsReturns = function () {
      if ($scope.returnsData.ordernum == '' || $scope.returnsData.ordernum == null ||
        $scope.returnsData.ordernum == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '订单流水号不能为空',
          okText: '确定'
        });
        return false;
      }

      order = $scope.returnsData.ordernum;

      var date = new Date();
      date.setDate(date.getDate() - 7);
      date = formatDate(date);
      if (order.substring(0, 8) < date.substring(0, 8)) {
        $ionicPopup.alert({
          title: '提示',
          template: '超出退货期限',
          okText: '确定'
        });
        return false;
      }

      console.log('select order start:', $scope.returnsData.ordernum);
      $http.post(urlReturns, {
        data: order.toString(),
        username: username,
        method: 'selectOrder'
      }).success(function (response) {
        console.log('select order success:', response);
        afterSelectOrder(response);
      }).error(function () {
        console.log('select order fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    };

    // 点击确认按钮
    $scope.returnsConfirm = function () {
      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = (parseFloat(total) - parseFloat(hasPay)).toFixed(2);
      if (parseFloat(noPay) < 0) {
        noPay = 0;
        noPay = noPay.toFixed(2);
      }
      $scope.returnsData.hasPay = hasPay;
      $scope.returnsData.noPay = noPay;

      $scope.returnsData.deletePay = false;
      loadPayMode();
    };

    // 点击 returns-pay.html 关闭按钮
    $scope.closeReturnsPay = function () {
      // 设置删除退款按钮不可见
      $scope.returnsData.deletePay = false;

      $ionicPopup.confirm({
        title: '提示',
        template: '该操作将清空退款信息，确认关闭退款页面',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          initializeInfo();
          $scope.modal.hide();
        }
      });
    };

    // 点击 returns-pay.html 某一支付方式按钮
    $scope.returnsPayMode = function (pm) {
      // 设置删除退款按钮不可见
      $scope.returnsData.deletePay = false;

      $scope.popupTradeData = {};

      if ($scope.returnsData.noPay == 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单已退款完成，无需再进行退款',
          okText: '确定'
        });
        return false;
      }
      $ionicPopup.show({
        title: pm['payname'],
        template: '<input type="number" placeholder="请输入退款金额" ng-model="popupTradeData.total">',
        scope: $scope,
        buttons: [
          {
            text: "取消",
            onTap: function () {
              return false;
            }
          },
          {
            text: "确定",
            type: "button-positive",
            onTap: function () {
              return true;
            }
          }
        ]
      }).then(function (result) {
        if (result) {
          returnsOrder(pm, $scope.popupTradeData.total);
        }
      });
    };

    // 点击删除退款按钮
    $scope.returnsDeletePay = function () {
      $scope.returnsData.deletePay = !$scope.returnsData.deletePay;
    };

    // 删除某一退款方式
    $scope.returnsDeletePayItem = function (p) {
      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否删除当前退款',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          deleteLinePay(p);
        }
      });
    };

    // 点击清空退款按钮
    $scope.returnsClearPay = function () {
      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否清空当前退款',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          pay = '';
          $scope.returnsData.pay = pay;

          hasPay = 0;
          hasPay = hasPay.toFixed(2);
          noPay = parseFloat(total);
          noPay = noPay.toFixed(2);
          $scope.returnsData.hasPay = hasPay;
          $scope.returnsData.noPay = noPay;
        }
      });
    };

    // 点击完成退款按钮
    $scope.returnsEndPay = function () {
      // 设置删除退款不可见
      $scope.returnsData.deletePay = false;

      if ($scope.returnsData.noPay != 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单未退款完成，不能完成退款',
          okText: '确定'
        });
        return false;
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '是否完成退款',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          returnsEndPay();
        }
      });
    };

    /**
     * 查询订单成功后相关操作
     *
     * @param response 查询订单成功后返回信息
     */
    function afterSelectOrder(response) {
      var commodityinfo, payinfo;

      if (response.msgcode == 1) {
        if (!(response.msgmain.username == '' || response.msgmain.username == null ||
          response.msgmain.username == undefined)) {
          $ionicPopup.alert({
            title: '提示',
            template: '该订单已经退款',
            okText: '确定'
          });
          return false;
        }

        commodityinfo = response.msgmain.commodityinfo.data;
        payinfo = response.msgmain.payinfo.data;
        total = response.msgmain.commodityinfo.total;
        cardfaceno = response.msgmain.commodityinfo.cardfaceno;
        console.log('afterSelectOrder read info success commodityinfo:', commodityinfo);
        console.log('afterSelectOrder read info success payinfo:', payinfo);
        console.log('afterSelectOrder read info success total:', total);
        console.log('afterSelectOrder read info success cardfaceno:', cardfaceno);

        $scope.returnsData.order = order;
        if (cardfaceno == '') {
          $scope.returnsData.customer = '普通';
        } else {
          $scope.returnsData.customer = '会员';
        }
        $scope.returnsData.commodity = commodityinfo;
        $scope.returnsData.total = total;

        $scope.returnsBlank = false;
        $scope.returnsOrder = true;
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '该订单不存在',
          okText: '确定'
        });
      }
    }

    /**
     * 加载退款支付方式
     */
    function loadPayMode() {
      console.log('loadPayMode start');
      $http.post(urlTrade, {
        method: 'loadPayMode'
      }).success(function (response) {
        console.log('loadPayMode success:', response);
        if (response.msgcode == 1) {
          $scope.returnsData.payMode = response.msgmain;
          $scope.modal.show();
        }
      }).error(function () {
        console.log('loadPayMode fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    }

    /**
     * 退款
     *
     * @param pm 支付方式payMode
     * @param total 退款金额
     */
    function returnsOrder(pm, total) {
      if (total <= 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '退款金额错误',
          okText: '确定'
        });
        return false;
      } else if (total == '' || total == null || total == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '退款金额不能为空',
          okText: '确定'
        });
        return false;
      } else if (total > parseFloat(noPay)) {
        $ionicPopup.alert({
          title: '提示',
          template: '退款金额超出最大可退款金额',
          okText: '确定'
        });
        return false;
      }

      total = total.toFixed(2);
      if (pay == '') {
        pay = '{' +
          '"no": "1",' +
          '"code": "' + pm["paycode"] + '",' +
          '"name": "' + pm["payname"] + '",' +
          '"total": "' + total + '"' +
          '}';
      } else {
        var no = $scope.returnsData.pay.length + 1;
        pay += ',{' +
          '"no": "' + no + '",' +
          '"code": "' + pm["paycode"] + '",' +
          '"name": "' + pm["payname"] + '",' +
          '"total": "' + total + '"' +
          '}';
      }
      console.log('returnsOrder success pay:', pay);

      var payJSON = '[' + pay + ']';
      $scope.returnsData.pay = JSON.parse(payJSON);
      console.log('returnsOrder success tradeData.pay:', $scope.returnsData.pay);

      hasPay = parseFloat(hasPay) + parseFloat(total);
      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = parseFloat(noPay) - parseFloat(total);
      noPay = parseFloat(noPay).toFixed(2);
      $scope.returnsData.hasPay = hasPay;
      $scope.returnsData.noPay = noPay;
    }

    /**
     * 删除某一退款
     *
     * @param p 要删除的支付方式
     */
    function deleteLinePay(p) {
      console.log('deleteLinePay returns begin:', p);
      var index = $scope.returnsData.pay.indexOf(p);
      var total = $scope.returnsData.pay[index]['total'];
      $scope.returnsData.pay.splice(index, 1);
      console.log('deleteLinePay returns success:', $scope.returnsData.pay);

      // 退款序号重新设置，删除某一退款后，后面退款序号依次减1
      for (var i = index; i < $scope.returnsData.pay.length; i++) {
        $scope.returnsData.pay[i]['no'] = parseInt($scope.returnsData.pay[i]['no']) - 1;
        console.log('deleteLinePay returns reset no success:', $scope.returnsData.pay);
      }

      // 将 pay 字符串中相应支付方式删除
      pay = JSON.stringify($scope.returnsData.pay);
      console.log('deleteLinePay returns reset pay begin:', pay);
      pay = pay.substring(pay.indexOf('[') + 1, pay.indexOf(']'));
      console.log('deleteLinePay returns reset pay success:', pay);

      // 将已退、未退金额做相关处理
      hasPay = parseFloat(hasPay) - parseFloat(total);
      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = parseFloat(noPay) + parseFloat(total);
      noPay = noPay.toFixed(2);
      $scope.returnsData.hasPay = hasPay;
      $scope.returnsData.noPay = noPay;
    }

    /**
     * 完成退款
     */
    function returnsEndPay() {
      saveReturns();
    }

    /**
     * 保存退款信息
     */
    function saveReturns() {
      console.log('saveReturns start:', $scope.returnsData.commodity);
      $http.post(urlReturns, {
        data: $scope.returnsData.commodity,
        username: username,
        order: $scope.returnsData.order,
        total: $scope.returnsData.total,
        cardfaceno: cardfaceno,
        method: 'saveReturns'
      }).success(function (response) {
        console.log('saveReturns success:', response);
        if (response.msgcode == 1) {
          saveReturnsPay();
        }
      }).error(function () {
        console.log('saveReturns fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    }

    /**
     * 保存退款支付信息
     */
    function saveReturnsPay() {
      console.log('saveReturnsPay start:', $scope.returnsData.pay);
      $http.post(urlReturns, {
        data: $scope.returnsData.pay,
        username: username,
        order: $scope.returnsData.order,
        haspay: $scope.returnsData.hasPay,
        method: 'saveReturnsPay'
      }).success(function (response) {
        console.log('saveReturnsPay success:', response);
        if (response.msgcode == 1) {
          initializeInfo();
          $scope.modal.hide();
        }
      }).error(function () {
        console.log('saveReturnsPay fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    }

    /**
     * 初始化相关数据
     */
    function initializeInfo() {
      $scope.returnsBlank = true;
      $scope.returnsOrder = false;

      $scope.returnsData.deletePay = false;

      order = '';
      $scope.returnsData.ordernum = order;
      $scope.returnsData.order = order;

      cardfaceno = '';
      $scope.returnsData.customer = '';

      $scope.returnsData.commodity = '';
      pay = '';
      $scope.returnsData.pay = pay;

      total = 0;
      hasPay = 0;
      noPay = 0;
      total = total.toFixed(2);
      hasPay = hasPay.toFixed(2);
      noPay = noPay.toFixed(2);
      $scope.returnsData.total = total;
      $scope.returnsData.hasPay = hasPay;
      $scope.returnsData.noPay = noPay;
    }
  });
