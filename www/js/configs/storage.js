(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(['$localStorageProvider',
        function ($localStorageProvider) {
            $localStorageProvider.setKeyPrefix('washery_');
        }])
})();