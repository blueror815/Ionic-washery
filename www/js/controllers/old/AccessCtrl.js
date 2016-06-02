(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('AccessCtrl', AccessCtrl);

    /* @ngInject */
    function AccessCtrl(userSessionService, $state, $ionicConfig) {
        switch (userSessionService.getSession().level) {
            case 'USER':
            case 'WASHER':
            case 'STAFF':
                $state.go('user.dashboard');
                break;
            default:
                $state.go('access.login');
        }
    }
})();