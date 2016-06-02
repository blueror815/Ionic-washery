(function() {
  'use strict';
  angular
    .module('washery.filters')
    .filter('num', num);
    
      function num() {
        return function(input) {
          return parseInt(input, 10);
        };
      }
})();