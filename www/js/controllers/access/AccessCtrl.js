(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('AccessCtrl', AccessCtrl);
    
    function AccessCtrl(userSessionService, $state)
    {
        if(userSessionService.isLoggedIn())
        {
            switch(userSessionService.getSession().level)
            {
                case 'USER':
                    $state.go('user.dashboard');
                break;

                case 'WASHER':
                    $state.go('washer.dashboard');
                break;
                    
                case 'STAFF':
                    $state.go('staff.dashboard');
                break;
                    
                default:
                    $state.go('access.login');
            }
        }
    }
})();