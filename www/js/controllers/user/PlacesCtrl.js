(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('PlacesCtrl', PlacesCtrl);

  /* @ngInject */
  function PlacesCtrl($scope, WasheryApi, $geolocation, $state, ErrorService, $uibModal)
  {
    var vm = this;
    angular.extend(vm, {
      map: {
        center: {
          latitude: 41.9102415,
          longitude: 12.3959118
        },
        zoom: 8
      },
      serverdZones: [],
      places: [],
      newPlace: {},
      selectedPlace: {},
      loadPlaces: false,
      addPlace: addPlace,
      setToDefault: setToDefault,
      deletePlace: deletePlace,
      selectPlace: selectPlace,
      saveNewPlace: saveNewPlace,
      cancelNewPlace: cancelNewPlace,
    });

    function loadPlaces(){
      vm.loadPlaces = true;
      WasheryApi.place.getList().then(function(response){
        vm.places = response.data.data;
        angular.forEach(vm.places,function(item){
          item.options = {
            icon:'images/car_marker.png',
            draggable:true
          };
          item.events = {
            dragend:function(){
              WasheryApi.place.update(item).then(function(){
                loadPlaces();
                console.log('Location updated');
              },function(response){
                loadPlaces();
                ErrorService.handle(response);
              });
            }
          };
        });
        vm.loadPlaces = false;
      },function(response){
        ErrorService.handle(response);
        vm.loadPlaces = false;
      });
    }
    loadPlaces();

    WasheryApi.utils.getServedZones().then(function(response){
        vm.serverdZones = response.data.data;
    },function(response){
      ErrorService.handle(response);
    });

    function addPlace(){
      vm.newPlace = {
        longitude:vm.map.center.longitude,
        latitude:vm.map.center.latitude,
        options :{
          draggable:true,
          icon:'images/car_marker.png'
        },
        events:{
          dragend:function(){
            WasheryApi.utils.checkServedCoords(vm.newPlace.latitude,vm.newPlace.longitude).then(function(response){
              if(response.data.error){
                vm.newPlace.isValid = false;
              } else {
                vm.newPlace.isValid = true;
              }

            },function(response){
              ErrorService.handle(response);
            });
          }
        },
        default:'0',
        isValid:false
      };
      $state.go('user.places.new');
    }

    function saveNewPlace(){
     console.log(1); WasheryApi.place.create(vm.newPlace.name,vm.newPlace.latitude,vm.newPlace.longitude,vm.newPlace.default).then(function(){
          loadPlaces();
          $state.go('user.places.all');
      },function(response){
        ErrorService.handle(response);
      });
    }

    function cancelNewPlace(){
      vm.newPlace = null;
      $state.go('user.places.all');
    }

    function deletePlace(location){
      WasheryApi.place.delete(location.id).then(function(){
        loadPlaces();
      },function(response){
        loadPlaces();
        ErrorService.handle(response);
      });
    }

    function setToDefault(newDefLoc){
      // Find old Default
      var oldDefLoc = null;
      for(var idx in vm.places){
        console.log(vm.places[idx]);
        if(vm.places[idx].default === '1'){
          oldDefLoc = vm.places[idx];
        }
      }
      console.log(oldDefLoc);
      if(oldDefLoc){
        $uibModal.open({
          animation: true,
          templateUrl: 'views/common/confirm.html',
          controller: function($scope,$uibModalInstance,text){
            $scope.text = text;
            $scope.close = function(){
              $uibModalInstance.dismiss();
            };
            $scope.done = function(){
              $uibModalInstance.close();
            };
          },
          size: 'sm',
          resolve:{
            text:function(){return 'Change default location to '+newDefLoc.name + '?';}
          }
        }).result.then(function () {
                    oldDefLoc.default = 0;
          WasheryApi.place.update(oldDefLoc).then(function(){

                       newDefLoc.default = 1; WasheryApi.place.update(newDefLoc).then(function(){
              loadPlaces();
            },function(err){
              ErrorService.handle(err);
            });
          },function(err){
            ErrorService.handle(err);
          });
        });
      } else {
                newDefLoc.default = 1;
        WasheryApi.place.update(newDefLoc).then(function(){
          loadPlaces();
        },function(err){
          ErrorService.handle(err);
        });
      }
    }

    function selectPlace(location){
      if(vm.selectedPlace.options) {vm.selectedPlace.options.icon = 'images/car_marker.png';}
      vm.selectedPlace = location;
      vm.selectedPlace.options.icon = 'images/car_marker_selected.png';
      vm.map.center = {
        longitude:vm.selectedPlace.longitude,
        latitude:vm.selectedPlace.latitude
      };
    }

    function setToCurrentPlace(){
      $geolocation.getCurrentPosition({
        enableHighAccuracy:true,
        timeout:60000,
        maximumAge:250
      }).then(function(res){
        vm.map.center = {
          longitude:res.coords.longitude,
          latitude:res.coords.latitude
        };
        vm.newPlace.longitude=res.coords.longitude;
        vm.newPlace.latitude=res.coords.latitude;
        vm.map.zoom = 15;
      });
    }
  }
})();