angular.module('returns.controller', ['returns.service'])
  .controller('returnsCtrl', function ($scope, $ionicModal, returnsFty, tradeFty, commonFty) {
    $scope.returnsData = {};

    $ionicModal.fromTemplateUrl('templates/returns-pay.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.returnsBlank = true;
    $scope.returnsOrder = false;

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
    // 是否已退款到支付宝
    var hasAlipay = false;
    // 是否已退款微信
    var hasWxpay = false;

    // 点击退货按钮
    $scope.returnsReturns = function () {
      if (!$scope.returnsData.ordernum) {
        commonFty.alertPopup('订单流水号不能为空');
        return false;
      }

      order = $scope.returnsData.ordernum;

      var date = new Date();
      date.setDate(date.getDate() - 7);
      date = formatDate(date);
      if (order.substring(0, 8) < date.substring(0, 8)) {
        commonFty.alertPopup('超出退货期限');
        return false;
      }

      var promise = returnsFty.selectOrder(order.toString(), localStorage.getItem('username'));
      promise.then(
        function (response) {
          if (response) {
            afterSelectOrder(response);
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

      commonFty.confirmPopup('该操作将清空退款信息，确认关闭退款页面').then(
        function (response) {
          if (response) {
            initializeInfo();
            $scope.modal.hide();
          }
        }
      )
    };

    // 点击 returns-pay.html 某一支付方式按钮
    $scope.returnsPayMode = function (pm) {
      // 设置删除退款按钮不可见
      $scope.returnsData.deletePay = false;

      if ($scope.returnsData.noPay == 0) {
        commonFty.alertPopup('当前订单已退款完成，无需再进行退款');
        return false;
      }

      if (pm["paycode"] == "10") {
        commonFty.alertPopup('不支持非码优惠券退款');
        return false;
      }

      // 支付宝、微信支付
      if (pm["paycode"] == "2" || pm["paycode"] == "3") {
        switch (pm["paycode"]) {
          case '2':
            if (hasAlipay) {
              commonFty.alertPopup('已退款到支付宝，无需重复退款');
              return false;
            }
            break;
          case '3':
            if (hasWxpay) {
              commonFty.alertPopup('已退款到微信，无需重复退款');
              return false;
            }
            break;
          default:
            break;
        }

        var promise = returnsFty.selectPayType(pm["paycode"], order.toString());
        promise.then(
          function (response) {
            if (response) {
              if (response.msgcode == 1) {
                thirdReturns(pm, response.msgmain);
              } else {
                commonFty.alertPopup('未知错误');
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
        );

        return false;
      }

      var message = '<input type="number" placeholder="请输入退款金额" id="input">';
      commonFty.showPopup(pm['payname'], message).then(
        function (response) {
          if (response.result) {
            returnsOrder(pm, response.input);
          }
        })
    };

    // 点击删除退款按钮
    $scope.returnsDeletePay = function () {
      $scope.returnsData.deletePay = !$scope.returnsData.deletePay;
    };

    // 删除某一退款方式
    $scope.returnsDeletePayItem = function (p) {
      commonFty.confirmPopup('该操作不可撤销，是否删除当前退款').then(
        function (response) {
          if (response) {
            deleteLinePay(p);
          }
        }
      )
    };

    // 点击清空退款按钮
    $scope.returnsClearPay = function () {
      commonFty.confirmPopup('该操作不可撤销，是否清空当前退款').then(
        function (response) {
          if (response) {
            pay = '';
            $scope.returnsData.pay = pay;

            hasPay = 0;
            hasPay = hasPay.toFixed(2);
            noPay = parseFloat(total);
            noPay = noPay.toFixed(2);
            $scope.returnsData.hasPay = hasPay;
            $scope.returnsData.noPay = noPay;
          }
        }
      )
    };

    // 点击完成退款按钮
    $scope.returnsEndPay = function () {
      // 设置删除退款不可见
      $scope.returnsData.deletePay = false;

      if ($scope.returnsData.noPay != 0) {
        commonFty.alertPopup('当前订单未退款完成，不能完成退款');
        return false;
      }

      commonFty.confirmPopup('是否完成退款').then(
        function (response) {
          if (response) {
            returnsEndPay();
          }
        }
      )
    };

    /**
     * 查询订单成功后相关操作
     *
     * @param response 查询订单成功后返回信息
     */
    function afterSelectOrder(response) {
      var commodityinfo, payinfo;

      if (response.msgcode == 1) {
        if (response.msgmain.username) {
          commonFty.alertPopup('该订单已经退款');
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
        if (cardfaceno) {
          $scope.returnsData.customer = '会员';
        } else {
          $scope.returnsData.customer = '普通';
        }
        $scope.returnsData.commodity = commodityinfo;
        $scope.returnsData.total = total;

        $scope.returnsBlank = false;
        $scope.returnsOrder = true;
      } else {
        commonFty.alertPopup('该订单不存在');
      }
    }

    /**
     * 加载退款支付方式
     */
    function loadPayMode() {
      var promise = tradeFty.loadPayMode();
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              $scope.returnsData.payMode = response.msgmain;
              $scope.modal.show();
            } else {
              commonFty.alertPopup('加载支付方式出错');
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

    /**
     * 退款到第三方，根据 pm 区分微信、支付宝
     *
     * @param pm
     * @param msgmain
     */
    function thirdReturns(pm, msgmain) {
      var payType;

      if (msgmain.paynum == 0) {
        commonFty.alertPopup('该订单未使用该付款方式付款，不能退款到该支付方式');
        return false;
      }

      switch (pm["paycode"]) {
        case '2':
          payType = 'ALIPAY';
          break;
        case '3':
          payType = 'WXPAY';
          break;
        default:
          break;
      }

      var timestamp = formatDateV2(new Date(), 'yyyy-MM-dd HH:mm:ss');

      var sign = '';
      var data = '{' +
        '"out_trade_no":"' + order + '",' +
        '"total_amount":"' + msgmain.paytotal + '",' +
        '"refund_amount":"' + msgmain.paytotal + '",' +
        '}';

      var promise = returnsFty.thirdReturns(data, sign, timestamp, payType);
      promise.then(
        function (response) {
          if (response) {
            if (response.biz_response.return_code == 100000) {
              returnsOrder(pm, response.biz_response.refund_fee);
            } else {
              commonFty.alertPopup(response.biz_response.return_msg);
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

    /**
     * 退款
     *
     * @param pm 支付方式payMode
     * @param total 退款金额
     */
    function returnsOrder(pm, total) {
      if (total <= 0) {
        commonFty.alertPopup('退款金额错误');
        return false;
      } else if (!total) {
        commonFty.alertPopup('退款金额不能为空');
        return false;
      } else if (total > parseFloat(noPay)) {
        commonFty.alertPopup('退款金额超出最大可退款金额');
        return false;
      }

      total = parseFloat(total).toFixed(2);
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

      switch (pm["paycode"]) {
        case '2':
          hasAlipay = true;
          break;
        case '3':
          hasWxpay = true;
          break;
        default:
          break;
      }
    }

    /**
     * 删除某一退款
     *
     * @param p 要删除的支付方式
     */
    function deleteLinePay(p) {
      if (pm["paycode"] == "2" || pm["paycode"] == "3" || pm["paycode"] == "10") {
        commonFty.alertPopup('该退款方式不允许删除');
      }

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
      var data = $scope.returnsData.commodity;
      var username = localStorage.getItem('username');
      var order = $scope.returnsData.order;
      var total = $scope.returnsData.total;

      var promise = returnsFty.saveReturns(data, username, order, total, cardfaceno);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              saveReturnsPay();
            } else {
              commonFty.alertPopup('保存退款信息出错');
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

    /**
     * 保存退款支付信息
     */
    function saveReturnsPay() {
      var data = $scope.returnsData.pay;
      var username = localStorage.getItem('username');
      var order = $scope.returnsData.order;
      var haspay = $scope.returnsData.hasPay;

      var promise = returnsFty.saveReturnsPay(data, username, order, haspay);
      promise.then(
        function (response) {
          if (response) {
            if (response.msgcode == 1) {
              initializeInfo();
              $scope.modal.hide();
            } else {
              commonFty.alertPopup('保存退款支付信息出错');
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
