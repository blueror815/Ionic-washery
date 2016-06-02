(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('match', match);

  /* @ngInject */
  function match($parse) {
    var directive = {
      link: link,
      require: '?ngModel',
      restrict: 'A',
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      var matchGetter = $parse(attrs.match);
      var caselessGetter = $parse(attrs.matchCaseless);
      var noMatchGetter = $parse(attrs.notMatch);
      var matchIgnoreEmptyGetter = $parse(attrs.matchIgnoreEmpty);

      if(!ctrl) {
          return;
      }

      function getMatchValue(){
        var match = matchGetter(scope);
        if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
            match = match.$viewValue;
        }
        return match;
      }

      scope.$watch(getMatchValue, function(){
          ctrl.$$parseAndValidate();
      });

      ctrl.$validators.match = function(){
        var match = getMatchValue();
        var notMatch = noMatchGetter(scope);
        var value;

        if (matchIgnoreEmptyGetter(scope) && !ctrl.$viewValue) {
          return true;
        }

        if(caselessGetter(scope)){
          value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
        }else{
          value = ctrl.$viewValue === match;
        }
        /*jslint bitwise: true */
        value ^= notMatch;
        /*jslint bitwise: false */
        return !!value;
      };
    }
  }
})();
