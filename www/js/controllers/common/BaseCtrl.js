(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('BaseCtrl', BaseCtrl);

  /* @ngInject */
  function BaseCtrl($rootScope, $scope, userSessionService, MessageService, PollingService, $window, $localStorage, WasheryApi, POLLING_INTERVAL)
  {
      var vm = this;
      angular.extend(vm, {
        logout: logout,
        amountNewMessages: amountNewMessages,
        getProfileImage: getProfileImage,
        getName: getName,
        toggleSearch: toggleSearch
      });

      // setup message polling    
      PollingService.register(MessageService.reloadCount, POLLING_INTERVAL);

      $scope.$window = $window;
      
      $rootScope.$emit('updateSelects');
      
      function logout()
      {
        userSessionService.logout();
      }

      function amountNewMessages()
      {
        return MessageService.newMessages();
      }

      function getProfileImage()
      {
        return userSessionService.getProfileImage();
      }

      function getName()
      {
       return userSessionService.getName();
      }
        
      function toggleSearch()
      {
        $scope.expand = !$scope.expand;
        if ($scope.expand) {
          $scope.$window.onclick = function (event) {
            closeSidebar(event, vm.toggleSearch);
          };
        } else {
          $scope.expand = false;
          $scope.$window.onclick = null;
          $scope.$apply();
        }
      }

      function closeSidebar(event, callbackOnClose)
      {
          var clickedElement = event.target;
          if (!clickedElement) return;
          var clickedOnDrawerButton = clickedElement.className.indexOf("icon ion-close-round")>-1 || clickedElement.className.indexOf("btn btn-default toggle-button on-md")>-1;
          if(clickedOnDrawerButton){
            return;
          }
          callbackOnClose();
          return;
      }
  }
})();