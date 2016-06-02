(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(httpProvider);

  /* @ngInject */
  function httpProvider($httpProvider) {
    $httpProvider.interceptors.push(function($q,$rootScope) {
      return {
        'responseError': function(rejection){
          var defer = $q.defer();
          if(rejection.status === 401){
            $rootScope.$emit('401');
          }
          defer.reject(rejection);
          return defer.promise;
        }
      };
    });
  }
})();