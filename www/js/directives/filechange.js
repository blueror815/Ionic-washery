(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('fileChange', fileChange);

  /* @ngInject */
  function fileChange() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
          maxFileSize: '=maxFilesize',
          fileChange:'=fileChange',
        }
    };
    return directive;

    function link(scope, element) {
      var handler = function (e) {
        if(scope.maxFileSize<e.target.files[0]){
          console.log('File is to big');
          return;
        }
        if(e.target.files[0].type.split('/')[0]!=='image'){
          console.log('File is no image');
          return;
        }
        scope.$apply(function () {
          if(scope.fileChange){scope.fileChange(e.target.files[0]);}
        });
      };

      element[0].addEventListener('change', handler, false);
    }
  }
})();
