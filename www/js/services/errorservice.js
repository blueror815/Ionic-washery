(function() {
  'use strict';
  angular
    .module('washery.services')
    .service('ErrorService', ErrorService);

  /* @ngInject */
  function ErrorService($ionicPopup, $rootScope) {
    var error = [];

    return {
      handle:function(response){
          
        if(response.hasOwnProperty(data))
        {
           switch(response.data.error.http_code)
            {
                default:
                    angular.forEach(response.data.error.message, function (item){
                       // ngToast.create({className:'danger',content:item});
                    });
                break;                
            } 
        }
        else if(response.hasOwnProperty(response))
        {
            switch(response.response.http_code)
            {
                default:
                //console.log(response.data.error);
                    if(angular.isObject(response.response.message))
                    {
                        angular.forEach(response.response.message, function (item){
                          //  ngToast.create({className:'danger',content:item});
                        });
                    }
                    else
                    {
                       // ngToast.create({className:'danger',content:response.response.message});
                    }
                break;                
            }
        }
          /*
        if(err.data.error && err.data.error.message){
          if(error[err.data.error.code]){
            ngToast.create({className:'danger',content:error[err.data.error.message]});
          } else {
            if(err.data.error.message instanceof Array || typeof err.data.error.message == 'object'){
              angular.forEach(err.data.error.message,function(item){
                ngToast.create({className:'danger',content:item});
              });
            } else {
              ngToast.create({className:'danger',content:err.data.error.message});
            }
          }
        } else {
          ngToast.create({className:'danger',content:error[0]});
        } */

      },
      customError:function(text){
        // An alert dialog
         // ngToast.create({className:'danger',content:text});
      }
    };
  }
})();