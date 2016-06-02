(function() {
  'use strict';
  angular
    .module('washery.services')
    .service('MessageService', MessageService);

  /* @ngInject */
  function MessageService(WasheryApi,$rootScope) {
    var msgCount = 0;
    WasheryApi.message.getNewMessagesCount().then(function(response){
      if(msgCount !== response.data.response.message){
        msgCount = response.data.response.message;
        $rootScope.$broadcast('message:update');
      }
    },function(response){
      console.log('Error',response);
    });
    return {
       newMessages:function(){
         return msgCount;
       },
       newMessagesCount: msgCount,
       reloadCount:function(){
        WasheryApi.message.getNewMessagesCount().then(function(response){
          if(msgCount !== response.data.response.message){
            msgCount = response.data.response.message;
            $rootScope.$broadcast('message:update');
          }
        },function(response){
          console.log('Error',response);
        });
       }
    };
  }
})();
