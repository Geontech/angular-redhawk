angular.module('gMapApp', [
    'ui.bootstrap',
    'ngRoute',
    'redhawk',
    'uiGmapgoogle-maps',  
  ])

  // Route configuration to load views into our single-page app
  .config(['$routeProvider', 
    function ($routeProvider) {
      $routeProvider
        .when('/example', {
            templateUrl: 'views/example.html',
            controller: 'GMapExampleController'
        })
        .otherwise({ redirectTo: '/example' });
    }
  ])

  // Configuration for the AngularJS gMap API
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      v: '3.17',
      libraries: 'weather,geometry,visualization',
      sensor: 'false'
    });
  })

  // View Controller for the google map example
  .controller('GMapExampleController', 
            ['$scope', '$timeout', 'REDHAWK', 'uiGmapGoogleMapApi',
    function( $scope,   $timeout,   REDHAWK,   uiGmapGoogleMapApi) {
      // See examples/basic for a detailed explanation on REDHAWK.addListener
      REDHAWK.addListener( 
        function(msg) {
          if (msg && msg.domains && msg.domains.length && !$scope.domain) {
            $scope.domain = REDHAWK.getDomain(msg.domains[0]);

            // Unlike the FeiTuner example, this example inserts our own 
            // "updateFinished" method onto the standard Domain instance.
            // The effect is similar to the customized Domain instance.
            $scope.domain.updateFinished.push( function () {
                angular.forEach($scope.domain.deviceManagers, 
                  function(manager) {
                    $scope.processDeviceManager(manager.id); 
                  });
                return false; // Runs once.
              });

            $scope.domain.on_msg = function(message) {
              // Messages/events often occur long before the server model is ready to
              // respond, so we use a timeout before attempting to "process"
              $timeout(function() {
                var adding = message.hasOwnProperty('sourceIOR');
                if (message.hasOwnProperty('sourceCategory')) {
                  switch (message.sourceCategory.value) {
                    case 'DEVICE_MANAGER':
                      if (adding)
                        $scope.processDeviceManager(message.sourceId);
                      break;
                    case 'DEVICE':
                      if (!adding)
                        $scope.removeGpsDevice(message.sourceId);
                      break;
                    default:
                      break;
                  }
                }
              }, 2000);
            }
          }
        });

      $scope.processDeviceManager = function (managerId) {
        $scope.domain.getDeviceManager(managerId).$promise.then(
          function(devMgr) {
            angular.forEach(devMgr.devices, function(device) {
              $scope.addGpsDevice(device.id, managerId);
            });
            return devMgr;
          });
      }

      // Map for successfully-created GenericGPS references.
      $scope.gpsDevices = {};

      // Attempt to create a GenericPGS device.  If the feiPort handle is valid,
      // this is a supported FEI GPS implementation that GenericGPS can manage.
      // Then, add to the map.
      $scope.addGpsDevice = function(deviceId, managerId) {
        var gps = $scope.domain.getDevice(deviceId, managerId, 'GenericGPS');
        $timeout(function() {
          if (gps.feiPort) {
            console.debug('GenericGPS Device discovered: ' + gps.name);
            $scope.gpsDevices[deviceId] = gps;
            if (!$scope.map.api) {
              $scope.apiDelayQueue.push(gps);
            }
            else if (-1 == findMarker(gps.id)) {
              $scope.map.markers.push($scope.makeMarker(gps));
            }
          }
          else {
            // Remove the GenericGPS factory version of this device since it's not valid for use.
            console.debug('GenericGPS could not represent Device: ' + gps.name);
            delete $scope.domain.devices[deviceId];
          }
        }, 1000);
      }

      // Set the reference to null, delete the mapping and marker (if found)
      $scope.removeGpsDevice = function(deviceId) {
        var self = this;
        if ($scope.gpsDevices[deviceId]) {
          $scope.gpsDevices[deviceId] = null;
          delete $scope.gpsDevices[deviceId];

          // Remove the marker
          var i = findMarker(deviceId);
          if (-1 < i)
            $scope.map.markers.splice(i, 1);
        }
      }

      // Note: Some of the directives require at least something to be defined originally!
      $scope.map = {
        instance: {}, // Will point to map instance once initialized.
        center: { 
          latitude:   39.1814287, 
          longitude: -76.7976317 
        }, 
        zoom:     5,
        // See: https://developers.google.com/maps/documentation/javascript/reference
        // Many options and other fields can be defined in here including `styles` to
        // to cut back on any unnecessary elements.
        options: {
          disableDefaultUI: true,
          overviewMapControl: true,
          zoomControl: true
        },
        // Hack to let map events get pushed back into AngularJS's scope
        events: {
          tilesloaded: function (map) {
            $scope.$apply(function() {
              $scope.map.instance = map;
            });
          }
        },
        markers: [],
        markerEvents: {
          click: function(markerObj, eventName, model, args) {
            $scope.toggleInfoWindow(model);
          },
          dragend: function (markerObj, eventName, model, args) {
            var gps = $scope.gpsDevices[model.id];
            console.debug('New position: ' + JSON.stringify(model.position));
            if (gps) {
              if (gps.isMovable) {
                gps.setPosition(model.position.latitude, model.position.longitude);
              }
              else {
                console.warn('GPS ' + gps.id + ' is no longer movable (feature not supported).');
              }

              // Async update retrieved from device
              markerObj.setDraggable(gps.isMovable);
            }
            else {
              console.error('Marker still exists for GPS device that has been removed: ' + model.id);
            }
          }
        },

        // Options for the infoWindow.  Toggling `show` will make it appear.
        infoWindow: {
          show: false
        }
      };

      // uiGmapGoogleMapApi is a promise.
      // The "then" callback function provides the google.maps object.
      apiDelayQueue = [];
      uiGmapGoogleMapApi.then(function(gMapsApi) {
        console.debug('Google Maps API v3 loaded...');
        $scope.map.api = gMapsApi;

        // Occasionally the API comes up "late" so this allows us to add previously
        // discovered markers.
        while (gpsDevice = apiDelayQueue.pop()) {
          $scope.map.markers.push($scope.makeMarker(gpsDevice));
        }
      });

      // Creates the marker structure for the gMap api.
      // NOTE: Requires the API to be loaded first, hennce the delay queue.
      $scope.makeMarker = function (gps) {
        var marker = {
          id:         gps.id,
          title:      gps.id,
          position:   gps.position,
          options: {
                      animation:  $scope.map.api.Animation.DROP,
                      draggable:  true, 
                      icon: {
                        url:        'bower_components/angular-redhawk/images/RedHawk_Logo_ALT_B_121px.png',
                        scaledSize: new $scope.map.api.Size(60,60),
                        origin:     new $scope.map.api.Point(0,0),
                        anchor:     new $scope.map.api.Point(30,30)
                      },
          }
        };
        gps.addListener(function() {
          $scope.updateMarker(marker, gps);
        });
        return marker;
      };

      $scope.updateMarker = function(marker, gps) {
        marker.position = gps.position;
      }

      // Utility function to find markers in the list by ID
      // Returns the index of the marker.
      var findMarker = function(id) {
        var foundIdx = -1;
        for (var i = 0; i < $scope.map.markers.length; i++) {
          if (id == $scope.map.markers[i].id) {
            foundIdx = i;
            break;
          }
        }
        return foundIdx;
      }
      // Toggle InfoWindow pop-up
      $scope.toggleInfoWindow = function(model) {
        var gps = undefined;
        // NOTE: assignment (=) in IF is deliberate.
        if (model && (gps = $scope.gpsDevices[model.id])) {
          if (gps == $scope.selectedDevice) {
            $scope.map.infoWindow.show = !$scope.map.infoWindow.show;
          }
          else {
            $scope.selectedDevice = gps;
            $scope.map.infoWindow.show = true;
          }
        }
        else {
          $scope.selectedDevice = {};
          $scope.map.infoWindow.show = false;
        }
      }
      $scope.toggleInfoWindow();
    }
  ])

  // Geon's GPS Wrapper (supports 'dummy' movable device)
  // Provides a convenience interface for UI development with
  // FEI GPS devices that have a Provides GPS port prefixed `gps` or `GPS`.
  .factory('GenericGPS', ['FEIDevice',
    function(FEIDevice) {
      // Define and extend from the base factory, FEIDevice
      var GenericGPS = function() {
        var self = this;
        FEIDevice.apply(self, arguments);
        // List of callbacks to fire during refresh()
        self._feiListeners = []; 

        // NOTE: Position is only updated after getPosition query completes.
        //       It is better to pass a callback to getPosition to receive
        //       timely updates.
        self.position = {latitude: 0.0, longitude: 0.0};
        self.positionIsValid = false;
        self.feiPort = undefined;
        self.isMovable = false;

        // If the configurable 'position' property struct exists, we can move
        // this "dummy" GPS FEI stand-in.
        self.setPosition = function(lat, lon) {
          if (self.isMovable) {
            self.configure([{ 
              id: 'position', 
              value: {
                'position::latitude': lat, 
                'position::longitude': lon
              }
            }]);
          }
        }

        // Async refresh of position.  
        // Pass a callback for when the update completes.
        // To have several entities update, add the callbacks
        // using addListener and have a single entity call refresh.
        // Callback receives a structure
        //    { latitude:  float, 
        //      longitude: float }
        self.getPosition = function(callback) {
          if (self.feiPort) {
            self.feiQuery(self.feiPort.name)
              .then(
                // "Success"
                function(response) {
                  self.position.latitude  = self.feiPort.gps_time_pos.position.lat;
                  self.position.longitude = self.feiPort.gps_time_pos.position.lon;
                  self.positionIsValid    = self.feiPort.gps_time_pos.position.valid;
                  return response;
                },
                // "Exception" Mark position as invalid
                function (err) {
                  self.positionIsValid = false;
                  return err;
                })
              .finally(
                // "Finally" Emit position regardless of update
                function(fin) {
                  if (callback)
                    callback(self.position);
                  return fin;
                }
              );
          }
          else {
            console.warn('GPS FEI Port handle not found; Unable to update position.');
          }
        }

        // One-time refresh method, emits position to any attached listeners
        self.refresh = function () {
          self.getPosition(function() {
            var i = self._feiListeners.length;
            // Notify and prune any stale listeners
            while (i--) {
              if (self._feiListeners[i])
                self._feiListeners[i](self.position);
              else
                self._feiListeners.splice(i, 1);
            }
          });
        }

        // Attach a callback for when a position update has been requested (by entity)
        self.addListener = function(callback) {
          self._feiListeners.push(callback);
        }

        self.removeListener = function(callback) {
          var i = self._feiListeners.length;
          while (i--) {
            if (self._feiListeners[i] == callback) {
              self._feiListeners.splice(i, 1);
              break;
            }
          }
        }

        // Add a run-many updateFinished that persistently updates isMovable.
        // Update isMovable.  The presence of the 'position' property structure
        // indicates this GPS can be reconfigured to a different location (i.e., demo dummy).
        self.updateFinished.push(function () {
          self.isMovable = (UtilityFunctions.findPropId(self.properties, 'position')) ? true : false;
        });

        // Add a run-once updateFinished that gives us a 
        // convenience property, feiPort, to use
        self.updateFinished.push(function() {
          angular.forEach(self.ports, function(port) {
            if (('FRONTEND' == port.idl.namespace) &&  
                ('GPS' == port.idl.type) &&
                ('Provides' == port.direction)) {
              self.feiPort = port;
            }
          });
          self.refresh();
          return false; // Run once
        });
      }

      GenericGPS.prototype = Object.create(FEIDevice.prototype);
      GenericGPS.prototype.constructor = GenericGPS;

      return GenericGPS;
    }])
;