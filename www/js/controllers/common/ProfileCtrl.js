(function() {
  'use strict';
  angular
    .module('washery')
    .controller('ProfileCtrl', ProfileCtrl);

  /* @ngInject */
  function ProfileCtrl($scope, userSessionService, $uibModal, WasheryApi, ngToast,ErrorService)
  {
    var vm = this;
    angular.extend(vm, {
      file: [],
      cngPassword: {},
      edit: false,
      session: angular.copy(userSessionService.getSession()),
      updateProfile: updateProfile,
      updateNoftificationSettings: updateNoftificationSettings,
      updatePassword: updatePassword,
      updateProfileImage: updateProfileImage
    });

    function updateProfile(){
      WasheryApi.user.update(filter(userSessionService.getSession(),vm.session)).then(function(){
        ngToast.create({className:'success',content:'Profil Information updated'});
        userSessionService.setSession(vm.session);
      },function(err){
        ErrorService.handle(err);
      });
      vm.edit=false;
    }

    function updateNoftificationSettings(){
      WasheryApi.user.updateNotificationSettings(vm.session.pushnot,vm.session.mailnot,vm.session.smsnot).then(function(){
        userSessionService.setSession(vm.session);
      },function(err){
        ErrorService.handle(err);
      });
    }

    function updatePassword(){
      if(vm.cngPassword.new === vm.cngPassword.check){
        WasheryApi.user.changePassword(vm.cngPassword.old,vm.cngPassword.new).then(function(){
          ngToast.create({className:'success',content:'Password changed'});
        },function(){
          ngToast.create({className:'danger',content:'Error while changing password'});
        });
      } else {
        ErrorService.customError('The repeated password is wrong!');
      }
    }

    function updateProfileImage(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/image_upload.html',
        controller: function($scope,$uibModalInstance,WasheryApi){
          $scope.image = null;
          
            $scope.close = function(){
              $uibModalInstance.dismiss();
            };
            $scope.done = function(){
              $uibModalInstance.close();
            };

        
          /**
           * Uploading files for avatar
           * @param  {object} file
           */
          $scope.upload = function(file) {
            WasheryApi.user.uploadImage(file).then(function (response) {
                if (response && response.length) {
                    vm.file = response.pop();
                    $uibModalInstance.close();
                }
            });
          };
        },
        size: 'md',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    }

    function filter(obj1, obj2) {
      var result = {};
      for(var key in obj1) {
        if(obj2[key] !== obj1[key]){
          result[key] = obj2[key];
        }
        if(obj2[key] instanceof Array && obj1[key] instanceof Array) {
          result[key] = filter(obj1[key], obj2[key]);
        }
        if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
          result[key] = filter(obj1[key], obj2[key]);
        }
      }
      return result;
    }
  }
})();
