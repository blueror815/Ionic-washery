(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('PasswordRecoveryCtrl', PasswordRecoveryCtrl);

  /* @ngInject */
  function PasswordRecoveryCtrl(WasheryApi, $stateParams, $state, ErrorService)
  {
    var vm = this;
    angular.extend(vm, {
      user: {},
      mail: null,
      password: null,
      recoverPassword: recoverPassword,
      changePassword: changePassword
    });

    function resetPassword()
    {
      WasheryApi.user.recoverPassword(vm.mail).then(function(response){
        if(response.status !== 200){
          ErrorService.handle(response.data);
        } else {
          ngToast.create({
            className: 'success',
            content: 'An Email was sent to your address.'
          });
          $state.go('access.login');
        }

      },function(response){
        ErrorService.handle(response.data);
      });
    }

    function changePassword()
    {
      WasheryApi.user.changePassword($stateParams.code, vm.password).then(function(response){
        if(response.status === 200){
          ngToast.create({
            className: 'danger',
            content: 'Password changed'
          });
          $state.go('access.login');
        } else {
          ngToast.create({
            className: 'danger',
            content: 'Somthing went wrong ...'
          });
        }
      },function(){
        ngToast.create({
          className: 'danger',
          content: 'Somthing went wrong ...'
        });
        $state.go('access.login');
      });
    }
  }
})();