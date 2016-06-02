(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('PasswordRecoveryCtrl', PasswordRecoveryCtrl);

    /* @ngInject */
    function PasswordRecoveryCtrl(
        WasheryApi,
        $stateParams,
        $state,
        $ionicPopup,
        ErrorService
    ) {
        var vm = this;
        angular.extend(vm, {
            user: {
                email: "",
                password: ""
            },
            resetPassword: resetPassword
        });

        function resetPassword() {
            WasheryApi.user.resetPassword(vm.user.email).then(function(response) {
                if (response.status !== 200) {
                    ErrorService.handle(response.data);
                } else {
                    var popup = $ionicPopup.confirm({
                        title: 'Success!',
                        template: 'An Email was sent to your address.'
                    });
                    $state.go('access.login');
                }
            }, function(response) {
                ErrorService.handle(response.data);
            });
        }
    }
})();