(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('UserCtrl', UserCtrl);
    
    /* @ngInject */
    function UserCtrl(WasheryApi, $state, $ionicConfig)
    {
        var vm = this;
        angular.extend(vm, {
          user: {
              name: '',
              username: '',
              image: ''
          }
        });
        
        WasheryApi.user.getSelf().then(success);
        
        function success(response)
        {
            console.log(response.data.data.name);
            vm.user.name = response.data.data.name;
            vm.user.username = response.data.data.username;
            vm.user.image = response.data.data.img;
        }
    } 
})();