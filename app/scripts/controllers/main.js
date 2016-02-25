'use strict';

/**
 * @ngdoc function
 * @name mapAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapAppApp
 */
angular.module('mapAppApp')
  .controller('MainCtrl', function ($scope, NgMap) {

    $scope.markers = [];
    var index = 0;

    $scope.mapConf = {
      zoom: 15,
      center: {
        lat: -33.8396, 
        lng: 151.2054
      }
    };

    NgMap.getMap().then(function(map) {
      map.setZoom($scope.mapConf.zoom);
      map.setCenter($scope.mapConf.center);
    });

    $scope.savePoint = function (event) {
      console.log(event.latLng.lng());
      $scope.markers.push({
        id: index,
        center: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng() 
        }
      });
      index += 1;
      console.log($scope.markers);
    };

    $scope.clearMarkers = function () {
      $scope.markers = [];
    };








  });
