(function() {
  'use strict';
  angular
    .module('washery.services')
    .service('NotificationService', NotificationService);

  /* @ngInject */
  function NotificationService() {
    var notifications = [];
    return {
      addNotification:function(title,text,date){
        notifications.push({title:title,text:text,date:date,isnew:true});
      },
      notifications:notifications
    };
  }
})();
