(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('PaymentsCtrl', PaymentsCtrl);

  /* @ngInject */
  function PaymentsCtrl(ngToast, WasheryApi, ErrorService, NgTableParams)
  {
    var vm = this;
    angular.extend(vm, {
      payments: null,
      tableParams: null,
      loadPaymentHistory: loadPaymentHistory,
      tableSetup: tableSetup
    });

    loadPaymentHistory();  
      
    function loadPaymentHistory()
    {
        WasheryApi.paymentaudit.getHistory().then(function(response){
          vm.payments = response.data.data;
          angular.forEach(vm.payments, function(item) {
              WasheryApi.user.getById(item.receiver).then(function(res){
                    item.receiver = res.data.data;
                });
          });
        },function(error){
            ErrorService.handle(error);
        });
        
        tableSetup();
    }

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
        dataset: vm.payments
      };
      vm.tableParams = new NgTableParams(initialParams, initialSettings);
    }
  }
})();