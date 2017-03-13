var website = 'http://localhost/PhonePos/';
// var website = 'http://123.206.23.41/PhonePos/';
var urlLogin = website + 'user.php';
var urlGetPerson = website + 'user.php';
var urlSettingPerson = website + 'user.php';
var urlGetSystem = website + 'system.php';
var urlSettingSystem = website + 'system.php';
var urlFeedback = website + 'feedback.php';
var urlTrade = website + 'trade.php';
var username, usercode;

angular.module('phonepos.controllers', [])

/**
 * login.html
 */
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
          username = $scope.loginData.username;
          usercode = response.msgmain.usercode;
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

        //TODO 测试
        //$state.go('menu.search');
      })
    };
  })

  /**
   * menu.html
   */
  .controller('menuCtrl', function ($scope) {
  })

  /**
   * trade.html
   */
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

      //生成流水号，流水号 = 当前时间(yyyyMMddHHmm) + 用户编码 + 四位随机数
      var randNum = Math.round(Math.random() * 1000);
      randNum = formatNumber(randNum, 4, '0', 'l');
      $scope.tradeData.order = formatDate(new Date()) + usercode + randNum;

      hasPay = hasPay.toFixed(2);
      noPay = parseFloat(total).toFixed(2);
      change = change.toFixed(2);
      $scope.tradeData.hasPay = hasPay;
      $scope.tradeData.noPay = noPay;
      $scope.tradeData.change = change;

      loadPayMode();
    };

    // 点击 trade-pay.html 关闭按钮
    $scope.closeTradePay = function () {
      $ionicPopup.confirm({
        title: '提示',
        template: '确认关闭支付页面',
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
      $scope.popupTradeData = {};

      if ($scope.tradeData.noPay == 0) {
        $ionicPopup.alert({
          title: '提示',
          template: '当前订单已支付完成，无需再进行支付',
          okText: '确定'
        });
      } else {
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
      }
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

      // 商品序号重新设置，删除某一商品后，后面商品序号一次减1
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
     * 上传流水信息
     */
    function saveSaleOrder() {
      console.log('saveSaleOrder start:', $scope.tradeData.commodity);
      $http.post(urlTrade, {
        data: $scope.tradeData.commodity,
        username: username,
        order: $scope.tradeData.order,
        total: $scope.tradeData.total,
        cardfaceno: cardfaceno,
        method: 'saveSaleOrder'
      }).success(function (response) {
        console.log('saveSaleOrder success:', response);
        if (response.msgcode == 1) {

        }
      }).error(function () {
        console.log('saveSaleOrder fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
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
        console.log('load pay mode fail:', '网络异常');
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
          '"price": "' + total + '"' +
          '}';
      } else {
        var no = $scope.tradeData.pay.length + 1;
        pay += ',{' +
          '"no": "' + no + '",' +
          '"code": "' + pm["paycode"] + '",' +
          '"name": "' + pm["payname"] + '",' +
          '"price": "' + total + '"' +
          '}';
      }
      console.log('payOrder success pay:', pay);

      var payJSON = '[' + pay + ']';
      $scope.tradeData.pay = JSON.parse(payJSON);
      console.log('payOrder success tradeData.pay:', $scope.tradeData.pay);

      hasPay = parseFloat(hasPay) + parseFloat(total);
      hasPay = parseFloat(hasPay).toFixed(2);
      noPay = parseFloat(noPay) - total;
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


    // console.log('payOrder start pm:', pm);
    // console.log('payOrder start total:', total);
    // $http.post(urlTrade, {
    //   data: pm,
    //   username: username,
    //   order: $scope.tradeData.order,
    //   total: total,
    //   method: 'payOrder'
    // }).success(function (response) {
    //   console.log('payOrder success:', response);
    //
    // }).error(function () {
    //   console.log('payOrder fail:', '网络异常');
    //   $ionicPopup.alert({
    //     title: '提示',
    //     template: '网络异常',
    //     okText: '确定'
    //   });
    // });
  })

  /**
   * dayover.html
   */
  .controller('dayoverCtrl', function ($scope, $http) {
    //TODO
  })

  /**
   * setting.html
   */
  .controller('settingCtrl', function ($scope, $state) {
    //点击取消按钮
    $scope.settingCancel = function () {
      //这里跳转到新界面需刷新，否则会有缓存，导致后续操作出问题
      $state.go('menu.trade');
      location.reload();
    };
  })

  /**
   * setting-person.html
   */
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

  /**
   * setting-system.html
   */
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

  /**
   * setting-app.html
   */
  .controller('settingAppCtrl', function ($scope) {
  })

  /**
   * setting-app-feedback.html
   */
  .controller('feedbackCtrl', function ($scope, $http, $ionicPopup) {
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
