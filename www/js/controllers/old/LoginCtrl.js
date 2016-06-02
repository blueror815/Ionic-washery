(function() { 
    'use strict';
    angular
        .module('washery.controllers')
        .controller('LoginCtrl', LoginCtrl)
    
    /* @ngInject */
    function LoginCtrl(userSessionService, $state, WasheryApi, ErrorService) 
    {
        var vm = this;
        angular.extend(vm, {
            user: {
                username:'',
                password:''
            },
            loading: false,
            login: login
        });

        if(userSessionService.isLoggedIn()){
            console.log('logged in');
          $state.go('user.dashboard');
        }
        
        function login(){
          vm.loading = true;
          WasheryApi.user.login(vm.user).then(loginSuccessful, loginError);
            function loginSuccessful(response){
                if(!response.data.error){
                    var session = response.data.data;
                    window.localStorage.session = session;
                    window.localStorage.created = new Date();
                    userSessionService.init(session);
                    WasheryApi.user.setApiKey(session.apikey);
                  $state.go('user.dashboard');
                } else {
                  ErrorService.handle(response);
                }
                vm.loading = false;
            }
            
            function loginError(error)
            {
                ErrorService.handle(error);
                vm.loading = false;
            }
        }
    }
})();