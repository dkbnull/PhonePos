angular.module('query.service', [])
  .factory('queryFty', function ($http, $q, GlobalVariable) {
    return {

      query: function (data, username, method) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.QUERY;

        console.log(method + ' start:', data);
        $http.post(url, {
          data: data,
          username: username,
          method: method
        }).success(function (response) {
          console.log(method + ' success:', response);
          deferred.resolve(response);
        }).error(function () {
          console.log(method + ' fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
