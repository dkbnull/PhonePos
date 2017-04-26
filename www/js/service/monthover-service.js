angular.module('monthover.service', [])
  .factory('monthoverFty', function ($http, $q, GlobalVariable) {
    return {

      loadMonthover: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.MONTHOVER;

        console.log('load monthover start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: 'loadMonthover'
        }).success(function (response) {
          console.log('load monthover success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('load monthover fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      monthover: function (data, date, total, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.MONTHOVER;

        console.log('monthover start:', data);
        $http.post(url, {
          data: data,
          date: date,
          total: total,
          username: username,
          method: 'monthover'
        }).success(function (response) {
          console.log('monthover success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('monthover fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
