(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('LoginCtrl', LoginCtrl)

    /* @ngInject */
    function LoginCtrl(userSessionService, WasheryApi, $localStorage, $sessionStorage, $state, ErrorService)
    {
        var vm = this;
        angular.extend(vm, {
            user: {
                username:'',
                password:'',
                rememberme: ''
            },
            loading: false,
            login: login
        });

        function login(){
          vm.loading = true;
          userSessionService.login(vm.user,function(response){
            if (response.message) {
              ErrorService.handle(response.message);
            } else {
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
            vm.loading = false;
          });
        }
    }
})();