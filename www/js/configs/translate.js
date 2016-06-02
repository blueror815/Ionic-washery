(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(lang);
      
      function lang(tmhDynamicLocaleProvider, $translateProvider, defaultLanguage) {
        tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');

        $translateProvider.useStaticFilesLoader({
           'prefix': 'i18n/',
           'suffix': '.json'
        });
        // $translateProvider.preferredLanguage(defaultLanguage);
        $translateProvider
            .registerAvailableLanguageKeys(['en', 'it'], {
            'en_*': 'en',
            'it_*': 'it'
          })
            .determinePreferredLanguage();
        $translateProvider.useSanitizeValueStrategy('sanitize');
      }
})();

