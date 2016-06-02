(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('BookingsCtrl', BookingsCtrl);

  /* @ngInject */
  function BookingsCtrl(ngToast, WasheryApi, ErrorService, $uibModal, $filter, NgTableParams, $localStorage) {
    var vm = this;

    angular.extend(vm, {
      bookings: [],
      washings: [],
      feedback: {
          vote: '',
          comment: ''
      },
      loading: false,
      tableParams: null,
      loadBookings: loadBookings,
 //     reportAbuse: reportAbuse,
      cancelBooking: cancelBooking,
      leaveFeedback: leaveFeedback,
      viewWashing: viewWashing,
      showWashing: false,
    });

    loadBookings();  
      
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
        dataset: vm.bookings
      };
      vm.tableParams = new NgTableParams(initialParams, initialSettings);
    }      
        
    function loadBookings(){
        vm.loading = true;
        WasheryApi.booking.getHistory().then(function(response){
            vm.bookings = response.data.data;
            angular.forEach(vm.bookings, function(item){
                WasheryApi.vehicle.getById(item.vehicle_id).then(function(res){
                    item.vehicle = res.data.data;
                });
                
                item.status = $filter('filter')($localStorage.Statuses.data, item.status);
                
                WasheryApi.place.getById(item.place_id).then(function(res){
                    item.place = res.data.data;
                });                
            });
        },function(err){
            ErrorService.handle(err);
        });
        vm.loading=false;
    }
/*
to washer
    function reportAbuse(booking){
      WasheryApi.booking.reportAbuse(booking.id).then(function(){
        ngToast.create({className:'success',context:'Abuse reported'});
      },function(err){
        ErrorService.handle(err);
      });
        loadBookings();
    }
*/
    function cancelBooking(booking)
    {
      WasheryApi.booking.cancel(booking.id).then(function(){
        ngToast.create({className:'success',context:'Booking canceled'});
      },function(err){
        ErrorService.handle(err);
      });
        loadBookings();
    }
      
    function leaveFeedback(booking_id){
      WasheryApi.washing.getByBookingId(booking_id).then(function(res){
          $uibModal.open({
          animation: true,
          templateUrl: 'views/user/modals/modal_feedback.html',
          controller: function($scope,$uibModalInstance){
            $scope.close = function(){
              $uibModalInstance.dismiss();
            };
            $scope.done = function(){
              $uibModalInstance.close({feedback:$scope.feedback});
            };

          },
          size: 'md'
        }).result.then(function (result) {
          vm.loading = true;
            console.log(result);
          WasheryApi.washing.addFeedback(result.feedback.vote, result.feedback.comment, booking_id).then(function(response){
// OK ng toast confirmation
           },function(err){
              ErrorService.handle(err.data);
           });
          },function(res){
            ErrorService.handle(res.data);
            
          });
      },function(err){
        ErrorService.handle(err);
      });
        loadBookings();
    }  
      
    function viewWashing(booking)
    {
      WasheryApi.washing.getByBookingId(booking.id).then(function(res){
          vm.washings = res.data.data;
          angular.forEach(vm.washings, function(item){
               /* WasheryApi.washer.getUname(item.washer_id).then(function(res){
                    item.washer = res.data.data;
                }); */
                
                item.status = $filter('filter')($localStorage.Statuses.data, item.status);               
            });
          vm.showWashing = true;
      },function(err){
        ErrorService.handle(err);
      });
    console.log(vm.washings);
    }
  }
})();