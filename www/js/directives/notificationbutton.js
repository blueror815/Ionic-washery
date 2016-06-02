(function() {
    'use strict';
    angular
        .module('washery.directives')
        .directive('notificationButton', notificationButton);

    /* @ngInject */
    function notificationButton(NotificationService) {
        var directive = {
          template: [
            '<div class="notify-container" uib-collapse="display" ng-style="pos">',
            '<h1 class="notify-header" >Notifications</h1>',
            '<div class="notify-notification"  ng-repeat="notifi in notifications">',
            '<h3 class="header" >{{notifi.title}}</h3>',
            '<p  class="text">{{notifi.text}}</p>',
            '<p  class="date">{{notifi.date}}</p>',
            '</div>',
            '<div ng-show="notifications.length<1">No Notification</div>',
            '</div>'
            ].join(''),
            controller: Controller,
            restrict: 'A',
            scope: {
            }
        };
        return directive;
    }

    /* @ngInject */
    function Controller($scope,$element,NotificationService) {
      $scope.notifications = NotificationService.notifications;
      $scope.display = true;
      $scope.pos={
        position:'absolute',
        right:'-17px',
        top:'35px',
      };
      $element.bind('click', function(){
        $scope.display=!$scope.display;
        console.log($scope.display);
        if (!$scope.$$phase && !$scope.$root.$$phase) {
          $scope.$apply();
        }
      });
    }
})();
