(function() {
  'use strict';
  angular
    .module('washery.services')
    .factory('geolocationservice', geolocationservice);

  /* @ngInject */
  function geolocationservice($q, $window) {
    var service = {
        getPosition: getPosition
    };
    return service;

    /**
     * Getting current user geoposition
     * @return {deferred.promise} Promise with coordinates or error
     */
    function getPosition() {
      var deferred = $q.defer();

      if (!$window.navigator.geolocation) {
          deferred.reject('Geolocation not supported.');
      } else {
          $window.navigator.geolocation.getCurrentPosition(
              function (position) {
                  deferred.resolve(position);
              },
              function (err) {
                  deferred.reject(err);
              });
      }

      return deferred.promise;
    }
  }
})();
