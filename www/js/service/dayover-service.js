angular.module('dayover.service', [])
  .factory('dayoverFty', function ($http, $q, GlobalVariable) {
    return {

      loadDayover: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.DAYOVER;

        console.log('load dayover start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: 'loadDayover'
        }).success(function (response) {
          console.log('load dayover success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('load dayover fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      dayover: function (data, date, total, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.DAYOVER;

        console.log('dayover start:', data);
        $http.post(url, {
          data: data,
          date: date,
          total: total,
          username: username,
          method: 'dayover'
        }).success(function (response) {
          console.log('dayover success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('dayover fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
