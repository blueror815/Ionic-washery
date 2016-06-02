(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('usernameAvailable', usernameAvailable);

  /* @ngInject */
  function usernameAvailable($timeout, WasheryApi) {
    var directive = {
        link: link,
        restrict: 'AE',
        require: 'ngModel'
    };
    return directive;
    function link(scope, elem, attrs, model) {
      model.$asyncValidators.unameExists = function() {
        return WasheryApi.user.userExists(elem.val()).then(function(){
          model.$setValidity('unameExists', true);
        },function(res){
          $timeout(function(){
            if(res.data.error.message.username[0] === 'The username has already been taken.') {
              model.$setValidity('unameExists', false);
            }
          });
        });
      };
    }
  }
})();