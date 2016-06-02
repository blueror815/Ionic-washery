(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('customSelect', customSelect);

  /* @ngInject */
  function customSelect() {
    var directive = {
      template: [
        '<div class="customSelect"><div class="display" ng-include="templateDisplay" ng-click="toggleDisplay()">',
        '</div><div class="items" style="position:relative;" ng-if="show">',
        '<div class="item" ng-repeat="item in items" ng-include="template" ng-click="select(item)">',
        '</div></div></div>'
      ].join(''),
      require: 'ngModel',
      link: link,
      restrict: 'E',
      scope: {
        template: '=template',
        templateDisplay: '=templateDisplay',
        model: '=ngModel',
        items: '=items',
        init: '=init',
        run: '=toRun'
      }
    };
    return directive;

    function link(scope) {
      scope.show=false;
      if(scope.init){
        scope.item = scope.init;
        scope.model = scope.init;
      }
      scope.$watch('model',function(){
        if(scope.item !== scope.model){
          scope.item = scope.model;
        }
      });
      scope.toggleDisplay = function(){
        scope.show = !scope.show;
      };
      scope.select=function(item){
        scope.model=item;
        scope.item=item;
        scope.show = false;
      };
    }
  }
})();
