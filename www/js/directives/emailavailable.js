(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('emailAvailable', emailAvailable);

  /* @ngInject */
  function emailAvailable($timeout, WasheryApi) {
    var directive = {
        link: link,
        restrict: 'AE',
        require: 'ngModel'
    };
    return directive;
    function link(scope, elem, attrs, model) {
      model.$asyncValidators.emailExists = function() {
        return WasheryApi.user.emailExists(elem.val()).then(function(){
          model.$setValidity('emailExists', true);
        },function(res){
          console.log(res);
          $timeout(function(){
            if(res.data.error) {
              model.$setValidity('emailExists', false);
            }
          });
        });
      };
    }
  }
})();