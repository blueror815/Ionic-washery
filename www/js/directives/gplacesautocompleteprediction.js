/*
(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('gPlacesAutocompletePrediction', gPlacesAutocompletePrediction);

  // @ngInject
  function gPlacesAutocompletePrediction() {
    var directive = {
      template: [
        '<span class="pac-icon pac-icon-marker"></span>',
        '<span class="pac-item-query" ng-bind-html="prediction | highlightMatched"></span>',
        '<span ng-repeat="term in prediction.terms | unmatchedTermsOnly:prediction">{{term.value | trailingComma:!$last}}&nbsp;</span>',
        '<span class="custom-prediction-label" ng-if="prediction.is_custom">&nbsp;{{prediction.custom_prediction_label}}</span>'
      ].join(''),
        restrict: 'A',
        scope:{
            index:'=',
            prediction:'=',
            query:'='
        },
    };
    return directive;
  }
})();
*/