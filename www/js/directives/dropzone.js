(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('dropzone', dropzone);

  /* @ngInject */
  function dropzone() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
          ondropclass: '=onDropClass',
          maxFileSize: '=maxFilesize',
          file: '=imagefile',
          onChange: '=onChange'
        }
    };
    return directive;

    function link(scope, element, attrs) {
      attrs = scope;
      element.bind('dragenter dragover', function(e){
        if (e.preventDefault) {e.preventDefault();}
        if (e.stopPropagation) {e.stopPropagation();}
        element.addClass(scope.ondropclass);
      });
        //EVENT: drag exit
      element.bind('dragleave dragexit', function(e){
        if (e.preventDefault) {e.preventDefault();}
        if (e.stopPropagation) {e.stopPropagation();}
        element.removeClass(scope.ondropclass);
      });
      element.bind('drop', function(e) {
        e.dataTransfer.effectAllowed = 'copy';
        if (e.preventDefault) {e.preventDefault();}
        if (e.stopPropagation) {e.stopPropagation();}
        element.removeClass(scope.ondropclass);
        var file = e.dataTransfer.files[0];
        if(file.size > (scope.maxFileSize||'7168')){
          console.log('File is to big');
          return;
        }
        if(file.type.split('/')[0] !=='image'){
          console.log('File is no image');
          return;
        }
        scope.file = file;
        if(scope.onChange){scope.onChange(file);}
        return false;
      });
    }
  }
})();
