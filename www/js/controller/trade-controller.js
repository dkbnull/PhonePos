angular.module('trade.controller', ['trade.service'])
  .controller('tradeCtrl', function ($scope, $http, $ionicModal, $ionicPopup) {
    $scope.tradeData = {};

    $ionicModal.fromTemplateUrl('templates/trade-pay.html', {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // TODO 测试
    username = 'test';
    usercode = '1234';

    // 商品编码
    var plucode;
    // 已添加的商品
    var commodity = '';
    // 会员卡面号
    var cardfaceno = '';
    // 是否验证会员，0：非会员；1：会员
    var isvip = 0;
    // 订单合计（应付）
    var total = 0;
    // 已付，未付，找零
    var hasPay = 0, noPay = 0, change = 0;
    // 已使用的支付方式
    var pay = '';


    $scope.tradeData.customer = '普通';
    total = total.toFixed(2);
    $scope.tradeData.total = total;

    // 点击确认按钮
    $scope.tradeConfirm = function () {
      // 设置行清删除按钮不可见
      $scope.tradeData.clearLine = false;

      if ($scope.tradeData.plucode == '' || $scope.tradeData.plucode == null ||
        $scope.tradeData.plucode == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '商品编码不能为空',
          okText: '确定'
        });
        return false;
      }

      plucode = $scope.tradeData.plucode;
      console.log('select commodity start:', $scope.tradeData.plucode);
      $http.post(urlTrade, {
        data: plucode,
        username: username,
        method: 'selectCommodity'
      }).success(function (response) {
        console.log('select commodity success:', response);
        afterSelectCommodity(response);
      }).error(function () {
        console.log('select commodity fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    };

    // 点击行清按钮
    $scope.tradeClearLine = function () {
      $scope.tradeData.clearLine = !$scope.tradeData.clearLine;
    };

    // 删除某一商品（行清）
    $scope.tradeClearLineItem = function (commod) {
      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否删除当前商品',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          clearLineCommodity(commod);
        }
      });
    };

    // 点击总清按钮
    $scope.tradeClearAll = function () {
      if (commodity == '') {
        return false;
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否清空当前订单',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          $scope.tradeData.commodity = '';
          commodity = '';
          total = 0;
          total = total.toFixed(2);
          $scope.tradeData.total = total;
          console.log('tradeClearAll begin:',
            '$scope.tradeData.commodity:' + $scope.tradeData.commodity +
            ';commodity:' + commodity);
        }
      });
    };

    // 点击会员按钮
    $scope.tradeVip = function () {
      // 设置行清删除按钮不可见
      $scope.tradeData.clearLine = false;

      $scope.popupTradeData = {};

      if (commodity != '') {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单非空，请总清后再录入会员',
          okText: '确定'
        });
      } else {
        $ionicPopup.show({
          title: '会员',
          template: '<input type="number" placeholder="请输入会员卡号" ng-model="popupTradeData.number">',
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
            verifyVip($scope.popupTradeData.number);
          }
        });
      }
    };

    // 点击合计按钮
    $scope.tradeTotal = function () {
      if (total == 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '请先录入商品，再合计',
          okText: '确定'
        });
        return false;
      }

      if ($scope.tradeData.order == '' || $scope.tradeData.order == null ||
        $scope.tradeData.order == undefined) {
        //生成流水号，流水号 = 当前时间(yyyyMMddHHmm) + 用户编码 + 四位随机数
        var randNum = Math.round(Math.random() * 1000);
        randNum = formatNumber(randNum, 4, '0', 'l');
        $scope.tradeData.order = formatDate(new Date()) + usercode + randNum;
      }

      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = (parseFloat(total) - parseFloat(hasPay)).toFixed(2);
      if (parseFloat(noPay) < 0) {
        noPay = 0;
        noPay = noPay.toFixed(2);
      }
      change = parseFloat(change).toFixed(2);
      $scope.tradeData.hasPay = hasPay;
      $scope.tradeData.noPay = noPay;
      $scope.tradeData.change = change;

      // 设置删除支付按钮默认不可见
      $scope.tradeData.deletePay = false;
      loadPayMode();
    };

    // 点击 trade-pay.html 关闭按钮
    $scope.closeTradePay = function () {
      // 设置删除支付按钮不可见
      $scope.tradeData.deletePay = false;

      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不删除订单信息，确认关闭支付页面',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          $scope.modal.hide();
        }
      });
    };

    // 点击 trade-pay.html 某一支付方式按钮
    $scope.tradePayMode = function (pm) {
      // 设置删除支付按钮不可见
      $scope.tradeData.deletePay = false;

      $scope.popupTradeData = {};

      if ($scope.tradeData.noPay == 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单已支付完成，无需再进行支付',
          okText: '确定'
        });
        return false;
      }
      $ionicPopup.show({
        title: pm['payname'],
        template: '<input type="number" placeholder="请输入支付金额" ng-model="popupTradeData.total">',
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
          payOrder(pm, $scope.popupTradeData.total);
        }
      });
    };

    // 点击删除支付按钮
    $scope.tradeDeletePay = function () {
      $scope.tradeData.deletePay = !$scope.tradeData.deletePay;
    };

    // 删除某一支付方式
    $scope.tradeDeletePayItem = function (p) {
      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否删除当前支付方式',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          deleteLinePay(p);
        }
      });
    };

    // 点击清空订单按钮
    $scope.tradeClearPay = function () {
      $ionicPopup.confirm({
        title: '提示',
        template: '该操作不可撤销，是否清空当前订单',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          initializeInfo();
          $scope.modal.hide();
        }
      });
    };

    // 点击完成支付按钮
    $scope.tradeEndPay = function () {
      // 设置删除支付按钮不可见
      $scope.tradeData.deletePay = false;

      if ($scope.tradeData.noPay != 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单未支付完成，不能完成支付',
          okText: '确定'
        });
        return false;
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '是否完成支付',
        okText: '确定',
        cancelText: '取消'
      }).then(function (result) {
        if (result) {
          orderEndPay();
        }
      });
    };

    /**
     * 查询商品成功后相关操作
     *
     * @param response 查询商品成功后返回信息
     */
    function afterSelectCommodity(response) {
      if (response.msgcode == 1) {
        if (response.msgmain.issale == '0') {
          $ionicPopup.alert({
            title: '提示',
            template: '该商品已下架',
            okText: '确定'
          });
        } else if (response.msgmain.isinventory == '0') {
          $ionicPopup.alert({
            title: '提示',
            template: '该商品库存为零',
            okText: '确定'
          });
        } else if (response.msgmain.ispresent == '1') {
          $ionicPopup.confirm({
            title: '提示',
            template: '该商品为赠品，是否销售',
            okText: '确定',
            cancelText: '取消'
          }).then(function (result) {
            if (result) {
              makeTradeCommodity(response);
            }
          });
        } else {
          makeTradeCommodity(response);
        }
      } else {
        $ionicPopup.alert({
          title: '提示',
          template: '不存在该商品',
          okText: '确定'
        });
      }
      $scope.tradeData.plucode = '';
    }

    /**
     * 组装商品信息
     *
     * @param response 查询商品成功后返回信息
     */
    function makeTradeCommodity(response) {
      var pluname, price, number, no;
      pluname = response.msgmain.pluname;
      if (isvip == 0) {
        price = response.msgmain.price;
      } else {
        price = response.msgmain.vipprice;
      }

      var commodityInfo =
        '<div class="commodity-info">商品编码：' + plucode + '</div>' +
        '<div class="commodity-info">商品名称：' + pluname + '</div>' +
        '<div class="commodity-info">发生价格：' + price + '元</div>' +
        '<div class="commodity-info commodity-number">销售数量：</div>';

      $scope.popupTradeData = {};
      $ionicPopup.show({
        title: '确认订单',
        template: commodityInfo + '<input type="number" class="commodity-input" placeholder="1" ng-model="popupTradeData.number">',
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
          if ($scope.popupTradeData.number <= 0) {
            return false;
          } else if ($scope.popupTradeData.number == '' ||
            $scope.popupTradeData.number == null ||
            $scope.popupTradeData.number == undefined) {
            number = 1;
          } else {
            number = $scope.popupTradeData.number;
          }

          if (commodity == '') {
            commodity = '{' +
              '"no": "1",' +
              '"code": "' + plucode + '",' +
              '"name": "' + pluname + '",' +
              '"price": "' + price + '",' +
              '"number": "' + number + '",' +
              '"total": "' + (price * number).toFixed(2) + '"' +
              '}';
          } else {
            no = $scope.tradeData.commodity.length + 1;
            commodity += ',{' +
              '"no": "' + no + '",' +
              '"code": "' + plucode + '",' +
              '"name": "' + pluname + '",' +
              '"price": "' + price + '",' +
              '"number": "' + number + '",' +
              '"total": "' + (price * number).toFixed(2) + '"' +
              '}';
          }
          console.log('makeTradeCommodity success commodity:', commodity);

          total = parseFloat(total) + price * number;
          total = total.toFixed(2);
          var commodityJSON = '[' + commodity + ']';
          $scope.tradeData.commodity = JSON.parse(commodityJSON);
          $scope.tradeData.total = total;
          console.log('makeTradeCommodity success tradeData.commodity:', $scope.tradeData.commodity);
        }
        $scope.popupTradeData.number = '';
      });
    }

    /**
     * 删除某一商品
     *
     * @param commod 要删除的商品
     */
    function clearLineCommodity(commod) {
      console.log('clearLineCommodity begin:', commod);
      var index = $scope.tradeData.commodity.indexOf(commod);
      var price = $scope.tradeData.commodity[index]['total'];
      $scope.tradeData.commodity.splice(index, 1);
      console.log('clearLineCommodity success:', $scope.tradeData.commodity);

      // 商品序号重新设置，删除某一商品后，后面商品序号依次减1
      for (var i = index; i < $scope.tradeData.commodity.length; i++) {
        $scope.tradeData.commodity[i]['no'] = parseInt($scope.tradeData.commodity[i]['no']) - 1;
        console.log('clearLineCommodity reset no success:', $scope.tradeData.commodity);
      }

      // 将 commodity 字符串中相应商品删除
      commodity = JSON.stringify($scope.tradeData.commodity);
      console.log('clearLineCommodity reset commodity begin:', commodity);
      commodity = commodity.substring(commodity.indexOf('[') + 1, commodity.indexOf(']'));
      console.log('clearLineCommodity reset commodity success:', commodity);

      // 将合计中总金额减去相应商品价格
      total = parseFloat(total) - price;
      total = total.toFixed(2);
      $scope.tradeData.total = total;
    }

    /**
     * 会员验证
     *
     * @param cardfno 卡面号
     */
    function verifyVip(cardfno) {
      if (cardfno == '' || cardfno == null || cardfno == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '卡号不能为空',
          okText: '确定'
        });
      } else {
        console.log('verifyVip start:', cardfno);
        $http.post(urlTrade, {
          data: cardfno,
          username: username,
          method: 'vipVerify'
        }).success(function (response) {
          console.log('verifyVip success:', response);
          if (response.msgcode == 1) {
            $scope.tradeData.customer = '会员（' + response.msgmain.name + '）';
            isvip = 1;
            cardfaceno = cardfno;
          } else {
            $ionicPopup.alert({
              title: '提示',
              template: '卡号错误',
              okText: '确定'
            });
          }
        }).error(function () {
          console.log('verifyVip fail:', '网络异常');
          $ionicPopup.alert({
            title: '提示',
            template: '网络异常',
            okText: '确定'
          });
        })
      }
    }

    /**
     * 加载支付方式
     */
    function loadPayMode() {
      console.log('loadPayMode start');
      $http.post(urlTrade, {
        method: 'loadPayMode'
      }).success(function (response) {
        console.log('loadPayMode success:', response);
        if (response.msgcode == 1) {
          $scope.tradeData.payMode = response.msgmain;
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
     * 支付订单
     *
     * @param pm 支付方式payMode
     * @param total 支付金额
     */
    function payOrder(pm, total) {
      if (total <= 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '支付金额错误',
          okText: '确定'
        });
        return false;
      } else if (total == '' || total == null || total == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '支付金额不能为空',
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
        var no = $scope.tradeData.pay.length + 1;
        pay += ',{' +
          '"no": "' + no + '",' +
          '"code": "' + pm["paycode"] + '",' +
          '"name": "' + pm["payname"] + '",' +
          '"total": "' + total + '"' +
          '}';
      }
      console.log('payOrder success pay:', pay);

      var payJSON = '[' + pay + ']';
      $scope.tradeData.pay = JSON.parse(payJSON);
      console.log('payOrder success tradeData.pay:', $scope.tradeData.pay);

      hasPay = parseFloat(hasPay) + parseFloat(total);
      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = parseFloat(noPay) - parseFloat(total);
      if (noPay >= 0) {
        noPay = noPay.toFixed(2);
      } else {
        change = -noPay;
        change = change.toFixed(2);
        noPay = 0;
        noPay = noPay.toFixed(2);
      }
      $scope.tradeData.hasPay = hasPay;
      $scope.tradeData.noPay = noPay;
      $scope.tradeData.change = change;
    }

    /**
     * 删除某一支付方式
     *
     * @param p 要删除的支付方式
     */
    function deleteLinePay(p) {
      console.log('deleteLinePay begin:', p);
      var index = $scope.tradeData.pay.indexOf(p);
      var total = $scope.tradeData.pay[index]['total'];
      $scope.tradeData.pay.splice(index, 1);
      console.log('deleteLinePay success:', $scope.tradeData.pay);

      // 支付方式序号重新设置，删除某一支付方式后，后面支付方式序号依次减1
      for (var i = index; i < $scope.tradeData.pay.length; i++) {
        $scope.tradeData.pay[i]['no'] = parseInt($scope.tradeData.pay[i]['no']) - 1;
        console.log('deleteLinePay reset no success:', $scope.tradeData.pay);
      }

      // 将 pay 字符串中相应支付方式删除
      pay = JSON.stringify($scope.tradeData.pay);
      console.log('deleteLinePay reset pay begin:', pay);
      pay = pay.substring(pay.indexOf('[') + 1, pay.indexOf(']'));
      console.log('deleteLinePay reset pay success:', pay);

      // 将已付、未付、找零金额做相关处理，相应支付方式已支付金额
      hasPay = parseFloat(hasPay) - parseFloat(total);
      hasPay = parseFloat(hasPay).toFixed(2);
      if (parseFloat(change) == 0) {
        noPay = parseFloat(noPay) + parseFloat(total);
        noPay = noPay.toFixed(2);
      } else {
        change = parseFloat(change) - total;
        if (change < 0) {
          noPay = -change;
          noPay = noPay.toFixed(2);
          change = 0;
          change = change.toFixed(2);
        } else {
          change = change.toFixed(2);
        }
      }
      $scope.tradeData.hasPay = hasPay;
      $scope.tradeData.noPay = noPay;
      $scope.tradeData.change = change;
    }

    /**
     * 完成支付
     */
    function orderEndPay() {
      saveOrder();
    }

    /**
     * 保存流水信息
     */
    function saveOrder() {
      console.log('saveOrder start:', $scope.tradeData.commodity);
      $http.post(urlTrade, {
        data: $scope.tradeData.commodity,
        username: username,
        order: $scope.tradeData.order,
        total: $scope.tradeData.total,
        cardfaceno: cardfaceno,
        method: 'saveOrder'
      }).success(function (response) {
        console.log('saveOrder success:', response);
        if (response.msgcode == 1) {
          savePay();
        }
      }).error(function () {
        console.log('saveOrder fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    }

    /**
     * 保存支付信息
     */
    function savePay() {
      console.log('savePay start:', $scope.tradeData.pay);
      $http.post(urlTrade, {
        data: $scope.tradeData.pay,
        username: username,
        order: $scope.tradeData.order,
        haspay: $scope.tradeData.hasPay,
        change: $scope.tradeData.change,
        method: 'savePay'
      }).success(function (response) {
        console.log('savePay success:', response);
        if (response.msgcode == 1) {
          initializeInfo();
          $scope.modal.hide();
        }
      }).error(function () {
        console.log('savePay fail:', '网络异常');
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
      $scope.tradeData.clearLine = false;
      $scope.tradeData.deletePay = false;

      plucode = '';
      $scope.tradeData.plucode = '';

      commodity = '';
      $scope.tradeData.commodity = '';
      pay = '';
      $scope.tradeData.pay = '';

      $scope.tradeData.order = '';

      cardfaceno = '';
      isvip = 0;
      $scope.tradeData.customer = '普通';

      total = 0;
      hasPay = 0;
      noPay = 0;
      change = 0;
      total = total.toFixed(2);
      hasPay = hasPay.toFixed(2);
      noPay = noPay.toFixed(2);
      change = change.toFixed(2);
      $scope.tradeData.total = total;
      $scope.tradeData.hasPay = hasPay;
      $scope.tradeData.noPay = noPay;
      $scope.tradeData.change = change;
    }
  });

/**
 * 格式化日期
 *
 * @param date 需要格式化的日期
 *
 * @return date 格式化后的日期
 */
function formatDate(date) {
  if (date == null || date == '' || date == undefined) {
    date = new Date();
  }

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = formatNumber(month, 2, '0', 'l');
  var day = date.getDate();
  day = formatNumber(day, 2, '0', 'l');
  var hour = date.getHours();
  hour = formatNumber(hour, 2, '0', 'l');
  var minute = date.getMinutes();
  minute = formatNumber(minute, 2, '0', 'l');
  date = year + month + day + hour + minute;

  return date;
}

/**
 * 格式化数值为指定长度
 *
 * @param number 需要格式化的数值
 * @param n 格式化后的长度
 * @param c 不足长度需要填充的字符
 * @param p 在原数值哪一侧填充字符
 *          l:左侧；r:右侧
 *
 * @return 格式化后的数值
 */
function formatNumber(number, n, c, p) {
  var length = number.toString().length;
  while (length < n) {
    if (p == 'l') {
      number = c + number;
    } else {
      number = number + c;
    }
    length++;
  }

  return number
}
