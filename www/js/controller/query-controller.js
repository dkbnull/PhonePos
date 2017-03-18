angular.module('query.controller', ['query.service'])
  .controller('queryCtrl', function ($scope, $http, $ionicPopup) {
    $scope.queryData = {};

    $scope.queryBlank = true;
    $scope.queryCommodityButton = false;
    $scope.queryInput = false;
    $scope.querySale = false;
    $scope.queryCommoditys = false;

    // 调用的方法
    var method = '';

    // 点击订单查询按钮
    $scope.queryOrder = function () {
      method = 'queryOrder';

      $scope.queryInput = true;

      $scope.queryCommodityButton = false;
      $scope.queryCommoditys = false;
    };

    // 点击商品查询按钮
    $scope.queryCommodity = function () {
      $scope.queryCommodityButton = true;

      $scope.queryInput = false;
      $scope.querySale = false;
    };

    // 点击所有按钮
    $scope.queryCommodityAll = function () {
      method = 'queryCommodityAll';

      $scope.queryInput = true;
    };

    // 点击按编码按钮
    $scope.queryCommodityCode = function () {
      method = 'queryCommodityCode';

      $scope.queryInput = true;
    };

    // 点击按名称按钮
    $scope.queryCommodityName = function () {
      method = 'queryCommodityName';

      $scope.queryInput = true;
    };

    // 点击确认按钮
    $scope.queryConfirm = function () {
      if ($scope.queryData.input == '' || $scope.queryData.input == null ||
        $scope.queryData.input == undefined) {
        $ionicPopup.alert({
          title: '提示',
          template: '查询关键字不能为空',
          okText: '确定'
        });
        return false;
      }

      var input = $scope.queryData.input;

      console.log(method + ' start:', $scope.queryData.input);
      $http.post(urlQuery, {
        data: input.toString(),
        username: username,
        method: method
      }).success(function (response) {
        console.log(method + ' success:', response);
        afterQuery(response);
      }).error(function () {
        console.log(method + ' fail:', '网络异常');
        $ionicPopup.alert({
          title: '提示',
          template: '网络异常',
          okText: '确定'
        });
      });
    };

    /**
     * 查询成功后相关操作
     *
     * @param response 查询成功后返回信息
     */
    function afterQuery(response) {
      var commodityinfo, total, cardfaceno;

      if (response.msgcode == 1) {
        if (response.msgmain.username != '') {
          $ionicPopup.alert({
            title: '提示',
            template: '该订单已经退款，不再提供查询',
            okText: '确定'
          });
          return false;
        }

        commodityinfo = response.msgmain.commodityinfo.data;
        total = response.msgmain.commodityinfo.total;
        cardfaceno = response.msgmain.commodityinfo.cardfaceno;
        console.log('afterQuery read info success commodityinfo:', commodityinfo);
        console.log('afterQuery read info success total:', total);
        console.log('afterQuery read info success cardfaceno:', cardfaceno);

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


      if (method == 'queryOrder') {
        $scope.queryBlank = false;
        $scope.querySale = true;
      } else {
        $scope.queryBlank = false;
        $scope.queryCommoditys = true;
      }
    }
  });
