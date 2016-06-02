(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('RegisterCtrl', RegisterCtrl);

  /* @ngInject */
  function RegisterCtrl(WasheryApi, ngToast, $stateParams, $state, $uibModal, $filter, ErrorService) {
    var vm = this;
    angular.extend(vm, {
      user: {},
      displayTOS: displayTOS,
      createWasher: createWasher,
      dispayPrivacy: dispayPrivacy,
      createAccount: createAccount,
      activateAccount: activateAccount,
    });

    function createAccount(){
      WasheryApi.user.create(vm.user).then(function(response){
        if(response.status !== 200){
          ErrorService.handle(response);
        }else {
          ngToast.create({
            className: 'success',
            content: 'Account created'
          });
          $state.go('access.login');
        }
      },function(error){
        ErrorService.handle(error);
      });
    }

    function createWasher(){
      vm.user.birthdate = $filter('date')(vm.user.birthdate,'MM/dd/yyyy');
//      vm.user.telephone = Number(vm.user.telephone);
      WasheryApi.washer.create(vm.user).then(function(response){
        if(response.status !== 200){
          ErrorService.handle(response);
        }else {
          ngToast.create({
            className: 'success',
            content: 'Account created'
          });
          $state.go('access.login');
        }
      },function(response){
        ErrorService.handle(response);
      });
    }

    function activateAccount(){
      WasheryApi.user.confirm($stateParams.code, $stateParams.username).then(function(response){
        if(response.error){
         ErrorService.handle(response);
        } else {
          ngToast.create({
            className: 'success',
            content: 'Account activated'
          });
        }
        $state.go('access.login');
      },function(response){
        ErrorService.handle(response);
      });
    }

    function displayTOS(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/tos.html',
        controller: function($scope,$uibModalInstance){
          $scope.close = function(){
            $uibModalInstance.close();
          };
        },
        size: 'md'
      });
    }

    function dispayPrivacy(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/privacy.html',
        controller: function($scope,$uibModalInstance){
          $scope.close = function(){
            $uibModalInstance.close();
          };
        },
        size: 'md'
      });
    }
  }
})();