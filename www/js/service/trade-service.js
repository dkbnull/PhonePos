angular.module('trade.service', [])
  .factory('tradeFty', function ($http, $q, GlobalVariable) {
    return {

      selectCommodity: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.TRADE;

        console.log('select commodity start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: 'selectCommodity'
        }).success(function (response) {
          console.log('select commodity success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('select commodity fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      vipVerify: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.TRADE;

        console.log('vip verify start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: 'vipVerify'
        }).success(function (response) {
          console.log('vip verify success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('vip verify fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      loadPayMode: function () {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.TRADE;

        console.log('load pay mode start');
        $http.post(url, {
          method: 'loadPayMode'
        }).success(function (response) {
          console.log('load pay mode success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('load pay mode fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      saveOrder: function (data, username, order, total, cardfaceno) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.TRADE;

        console.log('save order start:', data);
        $http.post(url, {
          data: data,
          username: username,
          order: order,
          total: total,
          cardfaceno: cardfaceno,
          method: 'saveOrder'
        }).success(function (response) {
          console.log('save order success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('save order fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      savePay: function (data, username, order, haspay, change) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.TRADE;

        console.log('save pay start:', data);
        $http.post(url, {
          data: data,
          username: username,
          order: order,
          haspay: haspay,
          change: change,
          method: 'savePay'
        }).success(function (response) {
          console.log('save pay success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('save pay fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      thirdPay: function (data, sign, timestamp, payType) {
        var deferred = $q.defer();
        var url = GlobalVariable.AIP_PATH;

        console.log('第三方支付支付 start:', data);
        $http.post(url, {
          partner_id: '*',
          app_id: GlobalVariable.APP_ID,
          method: GlobalVariable.AIP_PAY,
          format: GlobalVariable.FORMAT,
          charset: GlobalVariable.CHARSET,
          sign_type: 'MD5',
          sign: sign,
          timestamp: timestamp,
          version: GlobalVariable.VERSION,
          pay_type: payType,
          app_auth_token: '',
          notify_url: '',
          biz_content: data
        }).success(function (response) {
          console.log('第三方支付支付 success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('第三方支付支付 fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      fmPay: function (data, sign, timestamp) {
        var deferred = $q.defer();
        var url = GlobalVariable.AIP_PATH;

        console.log('非码优惠券支付 start:', data);
        $http.post(url, {
          partner_id: GlobalVariable.FM_PARTNER_ID,
          app_id: GlobalVariable.APP_ID,
          method: GlobalVariable.FM_METHOD,
          format: GlobalVariable.FORMAT,
          charset: GlobalVariable.CHARSET,
          sign_type: 'MD5',
          sign: sign,
          timestamp: timestamp,
          version: GlobalVariable.VERSION,
          pay_type: GlobalVariable.FM_PAY_TYPE,
          app_auth_token: '',
          notify_url: '',
          biz_content: data
        }).success(function (response) {
          console.log('非码优惠券支付 success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('非码优惠券支付 fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
