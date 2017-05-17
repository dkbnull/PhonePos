angular.module('returns.service', [])
  .factory('returnsFty', function ($http, $q, GlobalVariable) {
    return {

      selectOrder: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.RETURNS;

        console.log('select order start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: 'selectOrder'
        }).success(function (response) {
          console.log('select order success:', response);
          deferred.resolve(response);
        }).error(function () {
          console.log('select order fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      selectPayType: function (data, ordernum) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.RETURNS;

        console.log('select pay type start:', data);
        $http.post(url, {
          data: data,
          ordernum: ordernum,
          method: 'selectPayType'
        }).success(function (response) {
          console.log('select pay type success:', response);
          deferred.resolve(response);
        }).error(function () {
          console.log('select pay type fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      thirdReturns: function (data, sign, timestamp, payType) {
        var deferred = $q.defer();
        var url = GlobalVariable.AIP_PATH;

        console.log('第三方支付退款 start:', data);
        $http.post(url, {
          partner_id: '*',
          app_id: GlobalVariable.APP_ID,
          method: GlobalVariable.AIP_REFUND,
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
          console.log('第三方支付退款 success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('第三方支付退款 fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      saveReturns: function (data, username, order, total, cardfaceno) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.RETURNS;

        console.log('save returns start:', data);
        $http.post(url, {
          data: data,
          username: username,
          order: order,
          total: total,
          cardfaceno: cardfaceno,
          method: 'saveReturns'
        }).success(function (response) {
          console.log('save returns success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('save returns fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      saveReturnsPay: function (data, username, order, haspay) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.RETURNS;

        console.log('save returns pay start:', data);
        $http.post(url, {
          data: data,
          username: username,
          order: order,
          haspay: haspay,
          method: 'saveReturnsPay'
        }).success(function (response) {
          console.log('save returns pay success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('save returns pay fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
