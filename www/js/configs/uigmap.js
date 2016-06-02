(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(uiGmap);

  /* @ngInject */
  function uiGmap(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
  //  key: 'your api key',
  //    v: '3.20',
      libraries: 'weather,geometry,visualization,places'
    });
  }
})();
