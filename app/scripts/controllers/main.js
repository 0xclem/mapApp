'use strict';

/**
 * @ngdoc function
 * @name mapAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapAppApp
 */
angular.module('mapAppApp')
  .controller('MainCtrl', function ($scope, NgMap, $interval) {

    var DEFAULT_ACCURACY = 0;

    $scope.markers = [];
    $scope.circles = [];
    $scope.accuracy = DEFAULT_ACCURACY;
    $scope.pathsName = [
      {
        name: 'default',
        color: 'green',
      },
      {
        name: 'accuracy < 50',
        color: 'red'
      }
    ];
    $scope.polylines = [];

    var index = 0;
    var promise;

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
    

      google.maps.event.addListener(map, 'mousedown', function() {
        
        promise = $interval(function () { 
          $scope.accuracy += 1;
        }, 20);

        $scope.$digest();
      
      });

      google.maps.event.addListener(map, 'mouseup', function(event) {

        $interval.cancel(promise);
        
        $scope.markers.push({
          id: index,
          center: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng() 
          },
          timestamp: moment().format('DD MMM, HH:mm:ss'),
          accuracy: $scope.accuracy
        });

        $scope.circles.push({
          id: index,
          name: 'circle',
          strokeColor: '#00ceff',
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: '#00ceff',
          fillOpacity: 0.3,
          center: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng() 
          },
          radius: $scope.accuracy
        });

        $scope.accuracy = DEFAULT_ACCURACY;
        index += 1;

        $scope.$digest();
      });

    });


    $scope.clearMarkers = function () {
      $scope.markers = [];
      $scope.circles = [];
      $scope.polylines = [];
    };


    $scope.savePoint = function () {
      $interval.cancel(promise);
    };


    $scope.generate = function () {

      $scope.polylines = [];

      defaultPointsPath();
      lessThan50AccuracyPath();

    };

    function defaultPointsPath () {

      var points = _.cloneDeep($scope.markers);

      $scope.polylines.push({
        path: _.map(points, function (marker) {
          return [marker.center.lat, marker.center.lng];
        }),
        color: 'green'
      });

    }

    function lessThan50AccuracyPath () {

      var points = _.filter($scope.markers, function (marker) {
        return marker.accuracy < 50;
      });

      $scope.polylines.push({
        path: _.map(points, function (marker) {
          return [marker.center.lat, marker.center.lng];
        }),
        color: 'red'
      });

    }


  });
