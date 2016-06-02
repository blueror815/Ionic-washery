(function() {
  'use strict';
  angular
    .module('washery.directives')
    //Use this directive to open external links using inAppBrowser cordova plugin
    .directive('dynamicAnchorFix', function($ionicGesture, $timeout, $cordovaInAppBrowser) {
        return {
            scope: {},
            link: function(scope, element, attrs) {
                $timeout(function(){
                    var anchors = element.find('a');
                    if(anchors.length > 0)
                    {
                        angular.forEach(anchors, function(a) {

                            var anchor = angular.element(a);

                            anchor.bind('click', function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                var href = event.currentTarget.href;
                                var	options = {};

                                //inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

                                $cordovaInAppBrowser.open(href, '_blank', options)
                                    .then(function(e) {
                                        // success
                                    })
                                    .catch(function(e) {
                                        // error
                                    });
                            });

                        });
                    }
                }, 10);
            },
            restrict: 'A',
            replace: false,
            transclude: false
        };
    });
})();