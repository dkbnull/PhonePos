angular.module('query.controller', ['query.service'])
  .controller('queryCtrl', function ($scope, queryFty, commonFty) {
    $scope.queryData = {};

    $scope.queryBlank = true;
    $scope.queryCommodityButton = false;
    $scope.queryInput = false;
    $scope.querySale = false;
    $scope.queryCommoditys = false;

    // 调用的方法
    var method = '';
    // 关键字
    var input = '';

    // 点击订单查询按钮
    $scope.queryOrder = function () {
      method = 'queryOrder';

      $scope.queryInput = true;
      $scope.queryData.input = '';

      if ($scope.queryCommoditys) {
        $scope.queryBlank = true;
      }
      $scope.queryCommodityButton = false;
      $scope.queryCommoditys = false;
    };

    // 点击商品查询按钮
    $scope.queryCommodity = function () {
      $scope.queryCommodityButton = true;

      if ($scope.querySale) {
        $scope.queryBlank = true;
      }
      $scope.queryInput = false;
      $scope.querySale = false;
    };

    // 点击所有按钮
    $scope.queryCommodityAll = function () {
      method = 'queryCommodityAll';

      $scope.queryInput = false;

      var promise = queryFty.query('', localStorage.getItem('username'), method);
      promise.then(
        function (response) {
          if (response) {
            afterQuery(response);
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

    // 点击按编码按钮
    $scope.queryCommodityCode = function () {
      method = 'queryCommodityCode';

      $scope.queryInput = true;
      $scope.queryData.input = '';
    };

    // 点击按名称按钮
    $scope.queryCommodityName = function () {
      method = 'queryCommodityName';

      $scope.queryInput = true;
      $scope.queryData.input = '';
    };

    // 点击确认按钮
    $scope.queryConfirm = function () {
      if (!$scope.queryData.input) {
        commonFty.alertPopup('查询关键字不能为空');
        return false;
      }

      input = $scope.queryData.input;

      var promise = queryFty.query(input.toString(), localStorage.getItem('username'), method);
      promise.then(
        function (response) {
          if (response) {
            afterQuery(response);
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
     * 查询成功后相关操作
     *
     * @param response 查询成功后返回信息
     */
    function afterQuery(response) {
      if (method == 'queryOrder') {
        afterQueryOrder(response);
      } else {
        afterCommodity(response);
      }
    }

    /**
     * 查询订单成功后相关操作
     *
     * @param response 查询成功后返回信息
     */
    function afterQueryOrder(response) {
      var commodityinfo, total, cardfaceno;

      if (response.msgcode == 1) {
        if (response.msgmain.username) {
          commonFty.alertPopup('该订单已经退款，不能对其查询');
          return false;
        }

        commodityinfo = response.msgmain.commodityinfo.data;
        total = response.msgmain.commodityinfo.total;
        cardfaceno = response.msgmain.commodityinfo.cardfaceno;
        console.log('afterQuery read info success commodityinfo:', commodityinfo);
        console.log('afterQuery read info success total:', total);
        console.log('afterQuery read info success cardfaceno:', cardfaceno);

        $scope.queryData.order = input;
        if (cardfaceno) {
          $scope.queryData.customer = '会员';
        } else {
          $scope.queryData.customer = '普通';
        }
        $scope.queryData.commodity = commodityinfo;
        $scope.queryData.total = total;

        $scope.queryBlank = false;
        $scope.querySale = true;
      } else {
        commonFty.alertPopup('该订单不存在');

        $scope.queryData.order = '';
        $scope.queryData.customer = '';
        $scope.queryData.commodity = '';
        $scope.queryData.total = '';
      }
    }

    /**
     * 查询商品成功后相关操作
     *
     * @param response 查询成功后返回信息
     */
    function afterCommodity(response) {
      if (response.msgcode == 1) {
        $scope.queryData.commoditys = response.msgmain;

        $scope.queryBlank = false;
        $scope.queryCommoditys = true;
      } else {
        commonFty.alertPopup('不存在商品');

        $scope.queryData.commoditys = '';
      }
    }
  });
