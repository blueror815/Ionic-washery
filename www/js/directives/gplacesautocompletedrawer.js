/*(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('gPlacesAutocompleteDrawer', gPlacesAutocompleteDrawer);

  // @ngInject 
  function gPlacesAutocompleteDrawer($window, $document) {
    var directive = {
      template: [
          '<div class="pac-container" ng-if="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\', width: position.width+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">',
          '  <div class="pac-item" g-places-autocomplete-prediction index="$index" prediction="prediction" query="query"',
          '       ng-repeat="prediction in predictions track by $index" ng-class="{\'pac-item-selected\': isActive($index) }"',
          '       ng-mouseenter="selectActive($index)" ng-click="selectPrediction($index)" role="option" id="{{prediction.id}}">',
          '  </div>',
          '</div>'
      ].join(''),
        restrict: 'A',
        link: link,
        scope:{
          input: '=',
          query: '=',
          predictions: '=',
          active: '=',
          selected: '='
        },
    };
    return directive;

    function link($scope, element) {
      element.bind('mousedown', function (event) {
        event.preventDefault();  // prevent blur event from firing when clicking selection
      });

      $window.onresize = function () {
        $scope.$apply(function () {
            $scope.position = getDrawerPosition($scope.input);
        });
      };

      $scope.isOpen = function () {
        return $scope.predictions.length > 0;
      };

      $scope.isActive = function (index) {
        return $scope.active === index;
      };

      $scope.selectActive = function (index) {
        $scope.active = index;
      };

      $scope.selectPrediction = function (index) {
        $scope.selected = index;
      };

      $scope.$watch('predictions', function () {
        $scope.position = getDrawerPosition($scope.input);
      }, true);

      function getDrawerPosition(element) {
        var domEl = element[0],
          rect = domEl.getBoundingClientRect(),
          docEl = $document[0].documentElement,
          body = $document[0].body,
          scrollTop = $window.pageYOffset || docEl.scrollTop || body.scrollTop,
          scrollLeft = $window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        return {
          width: rect.width,
          height: rect.height,
          top: rect.top + rect.height + scrollTop,
          left: rect.left + scrollLeft
        };
      }
    }
  }
})();
*/