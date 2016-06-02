(function() {
    'use strict';
    angular
        .module('washery.controllers')
        .controller('DashboardCtrl', DashboardCtrl);

    /* @ngInject */
    function DashboardCtrl($scope, WasheryApi, ErrorService, $filter, userSessionService, $uibModal, $timeout, $sessionStorage, $state, geolocationservice)
    {
        var vm = this;
        angular.extend(vm, {
            loading: false,
            booking: {
                vehicle:null,
                washtype:500,
                price:0
            },
            minDate: new Date(),
            currentStage: 0,
            nextStep: nextStep,
    });

        //Step
        function nextStep()
        {
          vm.currentStage++;
          if(vm.currentStage===1)
              triggerResize();
          
          if(vm.currentStage===2)
              changeMethode(userSessionService.getSession().paymentprocessor_id);
        }
        
        function changeStage(selectedStage)
        {
          if(selectedStage < vm.currentStage)
              vm.currentStage = selectedStage;
        }
        
        function setStep(step)
        {
          vm.currentStage = step;
        }
        
        function previousStep()
        {
          vm.currentStage--;
        }
        
        $scope.$watch('booking.vehicle + booking.washtype',function(){
          if(vm.booking.vehicle && vm.booking.washtype){
            vm.loading = true; WasheryApi.booking.getPrice($scope.booking.vehicle.vehicletype_id,$scope.booking.washtype).then(function(response){
              vm.booking.price = response.data.response.message.price;
            },function(err){
              ErrorService.handle(err);
            });
            vm.loading = false;
          }
        },true);
        
        $scope.$watch('booking.vehicle',function(){
          if(vm.booking.vehicle)
              loadVehicleWashtypes();
        },true);

        $scope.$watch('booking.place',function(){
          if(vm.booking.place){
            vm.map = { center: { latitude: vm.booking.place.latitude, longitude: vm.booking.place.longitude }, zoom: 15 };
          }
        });
        
        function loadPaypal()
        {
          vm.loading = true;
          WasheryApi.booking.getPaypal(vm.booking.washtype).then(function(res){
            if(res.status === 302){
              console.log(res);
            }
            vm.paypalButton = res.data.response.message.url;
          },function(err){
            ErrorService.handle(err);
          });
            vm.loading = false;
        }

        function loadStripe()
        {
            vm.stripeId = userSessionService.getSession().stripe_id;   
        }
        
        if($sessionStorage.booking){
          vm.booking = JSON.parse($sessionStorage.booking.data);
          vm.booking.displaydate = new Date(vm.booking.date);
          console.log("Restored booking",vm.booking,JSON.parse($sessionStorage.booking.data));
          vm.currentStage=2;
          vm.paypalPaid = true;
        }
        
        $scope.paymentmethode = 302;
        
        function changeMethod(method){
          if(method === 301 && !vm.paypalButton){
            loadPaypal();
          }
          vm.paymentmethod = method;
        };
        
        $scope.changeMethode($scope.paymentmethode);
        $scope.gmapBooking = {};
        $scope.triggerResize = function(){
          $timeout(function() {
            $scope.gmapBooking.refresh();
          },500);
        };

        function loadVehicleWashtypes()
        {
            angular.forEach($localStorage.WashingTypes.data, function(item) {
                if(item.vehicletype_id == vm.booking.vehicle.vehicletype_id)
                {
                    vm.washtypes.push({
                        'id': item.id,
                        'name': item.code,
                        'vehicletype_id': item.vehicletype_id,
                    });
                }
            });
          }
        
        // $scope.map = { center: { latitude: 10, longitude: 10 }, zoom: 15 };
        $scope.loading.price = true;
        WasheryApi.vehicle.getList().then(function(response){
          $scope.vehicles = response.data.data;
          $scope.booking.vehicle = $scope.vehicles[0];
          $scope.loading.price = false;
        },function(err){
          ErrorService.handle(err);
        });
        WasheryApi.utils.getServedZones().then(function(response){
            $scope.serverdZones = response.data.data;
        },function(response){
          ErrorService.handle(response);
        });
        WasheryApi.place.getList().then(function(response){
            $scope.locations = response.data.data;
            angular.forEach($scope.locations,function(item){
              if(item.default==='1'){
                $scope.defLocation = item;
                // $scope.map = { center: { latitude: item.latitude, longitude: item.longitude }, zoom: 15 };
                geolocationservice.getPosition().then(function(resp) {
                  $scope.map = {
                    center: {
                      latitude: resp.coords.latitude,
                      longitude: resp.coords.longitude
                    },
                    zoom: 8
                  };

                })
                .catch(function(err){
                  console.log(err);
                  $scope.map = {
                    center: {
                      latitude: 41.9102415,
                      longitude: 12.3959118
                    },
                    zoom: 8
                  };
                });
              }
              item.options = {
                icon:'images/car_marker.png',
                draggable:false
              };
            });
        },function(response){
          ErrorService.handle(response);
        });

        $scope.createBooking = function(){
          $scope.booking.date = $filter('date')($scope.booking.displaydate,'MM/dd/yyyy');
          WasheryApi.user.paymentSetup($scope.paymentmethode).then(function(){
            $scope.loading.paymentmethode = false;
          },function(err){
            ErrorService.handle(err);
          });
          WasheryApi.booking.create($scope.booking.location.id,$scope.booking.vehicle.id,$scope.booking.washtype,$scope.booking.hour,$scope.booking.date,$scope.booking.note).then(function(response){
            if(response.data.error){
              ErrorService.customError(response.data.error.message);
            } else {
              //$scope.currentStage=0;
              //$scope.booking={};
              $state.go("page.bookings");
            }

          },function(err){
            ErrorService.handle(err);
          });
        };
        $scope.paypalPayment = function(){
          $scope.booking.date = $filter('date')($scope.booking.displaydate,'dd/MM/yyyy');
          $sessionStorage.booking = {data:JSON.stringify($scope.booking)};
        };
        $scope.stripePayment=function(code, result){
          $scope.loading.stripe = true;
           Stripe.card.createToken( $('#stripe-form'), function(status,res){
            if(status!==200){
              console.log(res.error.message);
              $scope.stripeErrortext = res.error.message;
              $scope.loading.stripe = false;
            } else {
              WasheryApi.user.paymentSetup(300,res.id).then(function(){
                $scope.loading.stripe = false;
                $scope.stripeId=res.id;
                var session = userSessionService.getSession();
                session.stripe_id=res.id;
                userSessionService.setSession(session);
              },function(err){
                ErrorService.handle(err);
              });
              $scope.stripeErrortext = null;
            }


            $scope.$apply();
           });
        };
        $scope.addVehicle = function(){
          $uibModal.open({
            animation: true,
            templateUrl: 'views/page/modals/modal_vehicle.html',
            controller: function($scope,$uibModalInstance){
              $scope.vehiclesTypes = WasheryApi.vehicle.vehicleTypes();
              $scope.newFile = null;
              $scope.onNewFile = function(file){
                $scope.newFile = file;
                var reader = new FileReader();
                reader.onload = function (e) {
                  $scope.newFile.src = e.target.result;
                  $scope.$apply();
                };
                reader.readAsDataURL(file);
              };
              $scope.close = function(){
                $uibModalInstance.dismiss();
              };
              $scope.done = function(){
                $uibModalInstance.close({car:$scope.car,image:$scope.newFile});
              };

            },
            size: 'md'
          }).result.then(function (result) {
            WasheryApi.vehicle.create(result.car).then(function(){
              WasheryApi.vehicle.getList().then(function(response){
                WasheryApi.vehicle.getList().then(function(response){
                  $scope.vehicles = response.data.data;
                },function(err){
                  ErrorService.handle(err);
                });
                WasheryApi.vehicle.setImage(result.image,response.data.data[response.data.data.length-1].id,function(){

                },function(err){
                  ErrorService.handle(err);
                });
              },function(err){
                ErrorService.handle(err);
              });
            },function(res){
              ErrorService.handle(res);
            });

          }, function () {});
        };
    }
})();
