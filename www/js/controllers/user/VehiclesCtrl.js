(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('VehiclesCtrl', VehiclesCtrl);

  /* @ngInject */
  function VehiclesCtrl($scope, WasheryApi, ErrorService, $uibModal, $filter, $localStorage, NgTableParams)
  {
    var vm = this;
    angular.extend(vm, {
      loading: false,
      vehicle: {
          model: '',
          color: '',
          plate: '',
          vehicletype_id: ''
      },
      vehicles: [],
      tableParams: null,
      addVehicle: addVehicle,
      deleteVehicle: deleteVehicle,
      tableSetup: tableSetup,
      vehicleTypes: [],
    });
      
    loadVehicles();

    function tableSetup() 
    {
      var initialParams = {
        count: 5 // initial page size
      };
      var initialSettings = {
        // page size buttons (right set of buttons in demo)
        counts: [],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: vm.vehicles
      };
      vm.tableParams = new NgTableParams(initialParams, initialSettings);
    }
      
    function loadVehicles()
    {
      vm.loading = true;
      WasheryApi.vehicle.getList(vm.currentPage).then(function(response){
        vm.vehicles = response.data.data;
      },function(error){
        ErrorService.handle(error);
      });
      vm.loading = false;
        
      tableSetup();
    }

    function deleteVehicle(vehicle)
    {
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/confirm.html',
        controller: function($scope,$uibModalInstance,text,data){
          $scope.text = text;
          $scope.close = function(){
            $uibModalInstance.dismiss();
          };
          $scope.done = function(){
            $uibModalInstance.close(data);
          };
        },
        size: 'sm',
        resolve:{
          text:function(){return 'Delete Vehicle?';},
          data:function(){return vehicle;}
        }
      }).result.then(function (res) {
        WasheryApi.vehicle.delete(res).then(function(){
          loadVehicles();
        },function(error){
          ErrorService.handle(error);
        });
      }, function () {});
    }

    function addVehicle()
    {
      vm.vehicleTypes = $localStorage.VehicleTypes.data;;
        $uibModal.open({
          animation: true,
          templateUrl: 'views/user/modals/modal_vehicle.html',
          controller: function($scope,$uibModalInstance){
              $scope.vehicleTypes = vm.vehicleTypes;
//            $scope.newFile = null;
//            $scope.onNewFile = function(file){
//              $scope.newFile = file;
//              var reader = new FileReader();
//              reader.onload = function (e) {
//                $scope.newFile.src = e.target.result;
//                $scope.$apply();
//              };
//              reader.readAsDataURL(file);
//            };
            $scope.close = function(){
              $uibModalInstance.dismiss();
            };
            $scope.done = function(){
              $uibModalInstance.close({vehicle:$scope.vehicle});
            };

          },
          size: 'md'
        }).result.then(function (result) {
          vm.loading = true;
          WasheryApi.vehicle.create(result.vehicle).then(function(response){
              loadVehicles();
//            WasheryApi.vehicle.getList().then(function(response){
//                if(result.vehicle.image != undefined)
//                {
//                  WasheryApi.vehicle.setImage(result.vehicle.image,response.data.data[response.data.data.length-1].id,function(){
//                    console.log('Vehicle Image Uploaded');
//                  },function(){
//                    console.log('Vehicle Image Upload Error');
//                  });
//                }
//                
           },function(err){
              ErrorService.handle(err.data);
           });
          });
            loadVehicles();
            vm.loading = false;
        }
  }
})();