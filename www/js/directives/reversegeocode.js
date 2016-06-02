(function() {
  'use strict';
  angular
    .module('washery.directives')
    .directive('reverseGeocode', reverseGeocode);

  /* @ngInject */
  function reverseGeocode(googlePlacesApi) {
  /**
   * Autocomplete directive. Use like this:
   *
   * <input type="text" g-places-autocomplete ng-model="myScopeVar" />
   */
    var directive = {
      template: '<div></div>',
        restrict: 'E',
        link: link,
        replace: true,
        scope:{
          coords: '=coords'
        },
    };
    return directive;

    function link($scope, element) {
      var geocoder = new googlePlacesApi.maps.Geocoder();
      $scope.$watch('coords.latitude + coords.longitude',function (){
        console.log('Coords changed');
        if($scope.coords && $scope.coords.latitude && $scope.coords.longitude){
          var latlng = new googlePlacesApi.maps.LatLng($scope.coords.latitude, $scope.coords.longitude);
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status === googlePlacesApi.maps.GeocoderStatus.OK) {
              console.log(results);
              if (results[0]) {
                element.text(results[0].formatted_address);
              } else {
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });

        }
      });
    }
  }
})();
