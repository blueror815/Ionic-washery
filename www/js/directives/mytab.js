(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('myTabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope) {
                var tabs = $scope.tabs = [];

                $scope.select = function(tab) {
                    angular.forEach(tabs, function(tab) {
                        tab.selected = false;
                    });
                    tab.selected = true;
                    $scope.$emit('my-tabs-changed', tab);
                };

                this.addTab = function(tab) {
                    if (tabs.length === 0) {
                        $scope.select(tab);
                    }
                    tabs.push(tab);
                };
            },
            templateUrl: 'views/common/my-tabs.html'
        };
    })
    .directive('myTab', function() {
        return {
            require: '^myTabs',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addTab(scope);
            },
            templateUrl: 'views/common/my-tab.html'
        };
    })
})();