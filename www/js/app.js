(function() {
  'use strict';
    
angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'washery' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('washery', [
    // vendor
    'ionic',
    'ionic.service.core',
    'ionic.service.analytics',
    'angularMoment',
    'underscore',
    'ngMap',
    'ngResource',
    'ngCordova',
    'slugifier',
  'ngMessages',
  'pascalprecht.translate',
  'tmh.dynamicLocale',
  'ionic-datepicker',

    'angularPayments',
      'angular-input-stars',
      'uiGmapgoogle-maps',
      'ngGeolocation',
      'google.places',
      'angular-ladda',
      'angular-loading-bar',
      'ngStorage',
      'ngTable',
      'ngFileUpload',
      'pascalprecht.translate',
    
    
    
  // custom
    'washery.constants',
    'washery.configs',
    'washery.services',
    'washery.filters',
    'washery.controllers',
    'washery.directives',
    'washery.views',
])
.run(runFunc);

    function runFunc(
    $ionicPlatform, 
    $ionicAnalytics, 
    $ionicConfig, 
    $rootScope, 
    $state, 
    $timeout, 
    PushNotificationsService, 
    $locale, 
    tmhDynamicLocale, 
    $translate, 
    availableLanguages, 
    defaultLanguage, 
    userSessionService, 
    ErrorService,
    $localStorage, 
    WasheryApi
    ) {
      $ionicPlatform.on("deviceready", function(){
        // Set app language
        setLanguage();

        // Analytics
        $ionicAnalytics.register();
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }

        // check if connection is available
        document.addEventListener("offline", onOffline, false);
          function onOffline() {
            var alertPopup = $ionicPopup.alert({
             title: 'error',
             template: 'disconnected'
            });

            alertPopup.then(function(res) {
              console.log('alert closed');
            });
          }

        // register device UUID
        PushNotificationsService.register();
      });

      // This fixes transitions for transparent background views
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if(toState.name.indexOf('access.walkthrough') > -1)
        {
          // set transitions to android to avoid weird visual effect in the walkthrough transitions
          $timeout(function(){
            $ionicConfig.views.transition('android');
            $ionicConfig.views.swipeBackEnabled(false);
            console.log("setting transition to android and disabling swipe back");
          }, 0);
        }
          
        // Block access to protected routes
          toParams = fromState = fromParams;
          if(toState.data && toState.data.auth){
              var valid = false;
              angular.forEach(toState.data.auth, function(item){
                  if(userSessionService.userHasPermission(item)){
                      valid = true;
                  }
              });
              if(!valid)
              {
                  console.log('auth error');
                  event.preventDefault();
                  userSessionService.logout();
              }
          }
      });
      
      $rootScope.$on('4001',function(){
          $ionicPopup.alert({
              title: 'Error',
              template: 'Timed out!'
          });
          $state.go('access.login');
      });
        
        $rootScope.$on('updateSelects',function(){
            console.log('updateSelects');
            WasheryApi.utils.getStatuses().then(function(resp) {
                $localStorage.Statuses = {};
                $localStorage.Statuses.data = resp.data.data;
                $localStorage.Statuses.update_date = new Date();//.format('MM/DD/YYYY');
            });

            WasheryApi.utils.getVehicleTypes().then(function(resp) {
                $localStorage.VehicleTypes = {};
                $localStorage.VehicleTypes.data = resp.data.data;
                $localStorage.VehicleTypes.update_date = new Date();//.format('MM/DD/YYYY');
            });

            WasheryApi.utils.getWashingTypes().then(function(resp) {
                $localStorage.WashingTypes = {};
                $localStorage.WashingTypes.data = resp.data.data;
                $localStorage.WashingTypes.update_date = new Date();//.format('MM/DD/YYYY');
            });

            WasheryApi.utils.getPaymentProcessors().then(function(resp) {
                $localStorage.PaymentProcessors = {};
                $localStorage.PaymentProcessors = resp.data.data;
                $localStorage.PaymentProcessors.update_date = new Date();//.format('MM/DD/YYYY');
            });
        });
        
      $ionicPlatform.on("resume", function(){
        PushNotificationsService.register();
      });

        // Internationalisation
        function applyLanguage(language) {
            tmhDynamicLocale.set(language.toLowerCase());
        }

        function getSuitableLanguage(language) {
            for (var index = 0; index < availableLanguages.length; index++) {
              if (availableLanguages[index].toLowerCase() === language.toLocaleLowerCase()) {
                return availableLanguages[index];
              }
            }
            return defaultLanguage;
        }

        function setLanguage() {
                if (typeof navigator.globalization !== "undefined") {
                    $cordovaGlobalization.getPreferredLanguage().then(function (result) {
                        var language = getSuitableLanguage(result.value);
                        applyLanguage(language);
                        $translate.use(language);
                    });
                } else {
                    applyLanguage(defaultLanguage);
                }
        }
    }
})();