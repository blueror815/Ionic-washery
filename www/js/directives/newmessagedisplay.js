(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('newMessageDisplay', newMessageDisplay);

  /* @ngInject */
  function newMessageDisplay(MessageService) {
    var directive = {
        link: link,
        template: '<span ng-if="newMsgs>0">{{newMsgs}}</span>',
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.newMsgs = MessageService.newMessages();
      scope.$on('message:update',function(){
        scope.newMsgs = MessageService.newMessages();
      });
    }
  }
})();
