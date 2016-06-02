(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
    
    /* @ngInject */
    function DashboardCtrl(userSessionService, $state, $ionicConfig)
    {         
        console.log('enter');
        if(userSessionService.isLoggedIn()){
        }

    } 
})();