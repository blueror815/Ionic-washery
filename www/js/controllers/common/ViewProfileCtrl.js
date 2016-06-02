(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('ViewProfileCtrl', ViewProfileCtrl);

  /* @ngInject */
  function ViewProfileCtrl(WasheryApi, ErrorService, $stateParams, $uibModal, ngToast) {
    var vm = this;
    angular.extend(vm, {
      profile: {
          id: '',
          username: '',
          img: '',
          points: ''
      },
      loadProfile: loadProfile,
      loading: false,
      sendMessage: sendMessage
    });

      loadProfile();
      
    function loadProfile()
    {
        vm.loading = true;
        WasheryApi.user.getByUname($stateParams.uname).then(function(response){
            vm.profile.id = response.data.data.id;
            vm.profile.username = response.data.data.username;
            vm.profile.image = response.data.data.img;
            vm.profile.reputation = response.data.data.reputation;
        },function(err){
            ErrorService.handle(err);
        });
        vm.loading = false;
    }
    
    function sendMessage(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/messages/modal_message.html',
        controller: function($scope,$uibModalInstance,message){
          $scope.message = message;
          $scope.close = function(){
            $uibModalInstance.dismiss();
          };
          $scope.done = function(){
            $uibModalInstance.close($scope.message);
          };
        },
        size: 'md',
        resolve: {
          message: function () {
            return {to:vm.profil.username};
          }
        }
      }).result.then(function (result) {
        WasheryApi.message.create(result.subject,result.body,result.to).then(function(){
          ngToast.create({className:'success',content:'Message send'});
        },function(err){
          ErrorService.handle(err);
        });
      }, function () {});
    }
  }
})();
