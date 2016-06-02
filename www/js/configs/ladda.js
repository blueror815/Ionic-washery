(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(ladda);
    
    function ladda(laddaProvider)
    {        
        laddaProvider.setOption({
          spinnerSize: 35,
          spinnerColor: '#222222'
        });
    }
})();