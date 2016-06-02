(function() {
  'use strict';
  angular
    .module('washery.filters')
    .filter('trailingComma', trailingComma);

  function trailingComma() {
    return function (input, condition) {
        return (condition) ? input + ',' : input;
    };
  }
})();