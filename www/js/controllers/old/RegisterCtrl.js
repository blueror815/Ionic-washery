(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('RegisterCtrl', RegisterCtrl);

    /* @ngInject */
    function RegisterCtrl(WasheryApi, $stateParams, $state, $filter, $ionicPopup, ErrorService) {
        var vm = this;
        angular.extend(vm, {
            user: {
                username: "",
                password: "",
                code: ""
            },
            createAccount: createAccount,
            activateAccount: activateAccount,
        });

        function createAccount() {
            WasheryApi.user.create(vm.user).then(createUserSuccess, createUserError);

            function createUserSuccess(response) {
                if (!response.status.error) {
                    var popup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'registrato'
                    });

                    $state.go('access.confirm');
                } else {
                    ErrorService.handle(response);
                }
            }

            function createUserError(response) {
                ErrorService.handle(response);
            }
        }

        function activateAccount() {
            WasheryApi.user.confirm(vm.user).then(function(response) {
                if (response.error) {
                    ErrorService.handle(response);
                } else {
                    var popup = $ionicPopup.confirm({
                        title: 'Success!',
                        template: 'Account activated'
                    });
                }
                $state.go('access.login');
            }, function(response) {
                ErrorService.handle(response);
            });
        }
    }
})();