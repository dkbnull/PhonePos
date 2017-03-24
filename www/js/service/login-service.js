angular.module('login.service', [])
  .factory('loginFty', function ($http, $q, GlobalVariable) {
    return {

      login: function (data) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.LOGIN;

        console.log('login start:', data);
        $http.post(url, {
          data: data,
          method: 'login'
        }).success(function (response) {
          console.log('login success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('login fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
