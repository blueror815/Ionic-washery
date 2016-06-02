(function() {
  'use strict';
  angular
    .module('washery.constants')
    .constant('POLLING_INTERVAL', 30000)
    .constant('API_URL', 'https://40.118.19.209/v1/')
    .constant('GCM_SENDER_ID', '574597432927')
    .constant('availableLanguages', ['en-GB', 'it-IT'])
    .constant('defaultLanguage', 'it-IT');
})();