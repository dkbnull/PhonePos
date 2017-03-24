/**
 * 通用功能
 */
angular.module('common.service', [])
  .factory('commonFty', function ($q, $ionicPopup) {
    return {

      alertPopup: function (message) {
        $ionicPopup.alert({
          title: '提示',
          template: message,
          okText: '确定'
        });
      },

      confirmPopup: function (message) {
        var deferred = $q.defer();

        $ionicPopup.confirm({
          title: '提示',
          template: message,
          cancelText: '取消',
          okText: '确定'
        }).then(function (result) {
          deferred.resolve(result);
        });

        return deferred.promise;
      },

      showPopup: function (title, message) {
        var deferred = $q.defer();

        $ionicPopup.show({
          title: title,
          template: message,
          buttons: [
            {
              text: "取消",
              onTap: function () {
                return false;
              }
            },
            {
              text: "确定",
              type: "button-positive",
              onTap: function () {
                return true;
              }
            }
          ]
        }).then(function (result) {
          // deferred.resolve(result);
          var input = document.getElementById("input").value;
          var response = '{"result":' + result + ',"input":"' + input + '"}';
          response = JSON.parse(response);
          deferred.resolve(response);
        });

        return deferred.promise;
      }
    }
  });
