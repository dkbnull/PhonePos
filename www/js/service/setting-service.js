angular.module('setting.service', [])
  .factory('setting', function () {
    return null;
  })

  .factory('settingPersonFty', function ($http, $q, GlobalVariable) {
    return {

      getPerson: function (username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.SETTING_PERSON;

        console.log('get person start:', username);
        $http.post(url, {
          username: username,
          method: 'getPerson'
        }).success(function (response) {
          console.log('get person success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('get person fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      settingPerson: function (data) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.SETTING_PERSON;

        console.log('setting person start:', data);
        $http.post(url, {
          data: data,
          method: 'settingPerson'
        }).success(function (response) {
          console.log('setting person success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('setting person fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  })

  .factory('settingSystemFty', function ($http, $q, GlobalVariable) {
    return {

      getSystem: function (username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.SETTING_SYSTEM;

        console.log('get system start:', username);
        $http.post(url, {
          username: username,
          method: 'getSystem'
        }).success(function (response) {
          console.log('get system success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('get system fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      },

      settingSystem: function (data, username, systemNull) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.SETTING_SYSTEM;

        console.log('setting person start:', data);
        $http.post(url, {
          data: data,
          username: username,
          systemNull: systemNull,
          method: 'settingSystem'
        }).success(function (response) {
          console.log('setting person success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('setting person fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  })

  .factory('settingApp', function () {
    return null;
  })

  .factory('settingAppAll', function () {
    return null;
  })

  .factory('settingAppFeedbackFty', function ($http, $q, GlobalVariable) {
    return {

      feedback: function (data, username) {
        var deferred = $q.defer();
        var url = GlobalVariable.SERVER_PATH + GlobalVariable.FEEDBACK;

        console.log('feedback start:', username);
        $http.post(url, {
          data: data,
          username: username,
          method: 'feedback'
        }).success(function (response) {
          console.log('feedback success:', response);
          deferred.resolve(response);
        }).error(function (response) {
          console.log('feedback fail:', response);
          deferred.reject(response);
        });

        return deferred.promise;
      }
    };
  });
