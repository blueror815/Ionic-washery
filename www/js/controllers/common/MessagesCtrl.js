(function() {
  'use strict';
  angular
    .module('washery.controllers')
    .controller('MessagesCtrl', MessagesCtrl);

  /* @ngInject */
  function MessagesCtrl(MessageService, $uibModal, WasheryApi, ngToast, ErrorService) {
    var vm = this;
    var MESSAGE_STATUS = {
      new: 50,
      read: 51,
      trash: 52
    };

    angular.extend(vm, {
      reply: reply,
      newMessages: [],
      archiveMessages: [],
      outboxMessages: [],
      trashedMessages: [],
      newMessage: newMessage,
      readMessage: readMessage,
      messageCount: messageCount,
      deleteMessage: deleteMessage,
      reloadMessages: reloadMessages,
      deleteSeclectedMessages: deleteSeclectedMessages,
    });

    loadMessages();  
      
    function loadMessages()
    {
      WasheryApi.message.getByStatus(MESSAGE_STATUS.new).then(function(response){
        vm.newMessages = response.data.data;
      });
      WasheryApi.message.getByStatus(MESSAGE_STATUS.read).then(function(response){
        vm.archiveMessages = response.data.data;
      });
      WasheryApi.message.getByStatus(MESSAGE_STATUS.trash).then(function(response){
        vm.trashedMessages = response.data.data;
      });
      WasheryApi.message.getSent().then(function(response){
        vm.outboxMessages = response.data.data;
      });
      MessageService.reloadCount();
    }

    function deleteMessage(id)
    {
      WasheryApi.message.trash(id).then(function(){
        loadMessages();
      },function(err){
        ErrorService.handle(err);
        loadMessages();
      });
    }

    function deleteSeclectedMessages()
    {
      for(var idx in vm.newMessages){
        if(vm.newMessages[idx].selected){
          vm.deleteMessage(vm.newMessages[idx].id);
        }
      }
      for(var idx1 in vm.archiveMessages){
        if(vm.archiveMessages[idx1].selected){
          vm.deleteMessage(vm.archiveMessages[idx1].id);
        }
      }
      for(var idx2 in vm.outboxMessages){
        if(vm.outboxMessages[idx2].selected){
          vm.deleteMessage(vm.outboxMessages[idx2].id);
        }
      }
      loadMessages();
    }

    function newMessage()
    {
       $uibModal.open({
        animation: true,
        templateUrl: 'views/common/messages/modal_message.html',
        controller: function($scope,$uibModalInstance){
          $scope.message = {};
          $scope.close = function(){
            $uibModalInstance.dismiss();
          };
          $scope.done = function(){
            $uibModalInstance.close($scope.message);
          };
        },
        size: 'md'
      }).result.then(function (result) {
        WasheryApi.message.create(result).then(function(){
          ngToast.create({className:'success',content:'Message send'});
        },function(err){
          ErrorService.handle(err);
        });
      }, function () {});
    }

    function readMessage(id)
    {
      WasheryApi.message.getById(id).then(function(){
        console.log('Marked Message as read');
      },function(err){
        ErrorService.handle(err);
      });
    }

    function reply(msg)
    {
      //replyToMessage
      $uibModal.open({
        animation: true,
        templateUrl: 'views/common/messages/modal_message.html',
        controller: function($scope,$uibModalInstance,message){
          $scope.message = message;
          $scope.message.body = '';
          $scope.disableHeader = true;
          $scope.close = function(){
            $uibModalInstance.dismiss();
          };
          $scope.done = function(){
            $uibModalInstance.close($scope.message);
          };
        },
        size: 'md',
        resolve: {
          message: function () {
            return msg;
          }
        }
      }).result.then(function (result) {
        WasheryApi.message.reply(result.id,result.body).then(function(){
          ngToast.create({className:'success',content:'Message send'});
        },function(err){
          ErrorService.handle(err);
        });
      }, function () {});
    }

    function reloadMessages()
    {
      loadMessages();
    }

    function messageCount()
    {
      return MessageService.newMessages();
    }
  }
})();