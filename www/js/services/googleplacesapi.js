(function() {
    'use strict';
    angular
        .module('washery.services')
        .factory('googlePlacesApi', googlePlacesApi);

    /* @ngInject */
    function googlePlacesApi($window) {
      if (!$window.google) {throw 'Global `google` var missing. Did you forget to include the places API script?';}
      return $window.google;
    }
})();
