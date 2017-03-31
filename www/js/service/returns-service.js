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
