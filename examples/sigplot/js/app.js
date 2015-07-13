/*
  This file is protected by Copyright. Please refer to the COPYRIGHT file
  distributed with this source distribution.

  This file is part of REDHAWK rest-python.

  REDHAWK rest-python is free software: you can redistribute it and/or modify it under
  the terms of the GNU Lesser General Public License as published by the Free
  Software Foundation, either version 3 of the License, or (at your option) any
  later version.

  REDHAWK rest-python is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
  A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
  details.

  You should have received a copy of the GNU Lesser General Public License along
  with this program.  If not, see http://www.gnu.org/licenses/.
*/

angular.module('SigPlotApp', [
    'ui.bootstrap',
    'ngRoute',
    'RedhawkServices',
    'RedhawkSigPlot',
  ])

  // Route configuration to load views into our single-page app
  .config(['$routeProvider', 
    function ($routeProvider) {
      $routeProvider
        .when('/example', {
            templateUrl: 'views/example.html',
            controller: 'ExampleController'
        })
        .otherwise({ redirectTo: '/example' });
    }
  ])

  /** 
   * Example of wrapping the RedhawkDomain to tap directly into the message stream.
   * Here, we'll follow DEVICE_MANAGER's coming online to check for devices that 
   * streamed to the sigplot instance, and creating a default RedhawkDevice instance 
   * for each.
   */
  .factory('DomainWrapper', ['RedhawkDomain', '$timeout',
    function(RedhawkDomain, $timeout) {
      var DomainWrapper = function () {
        var self = this;
        RedhawkDomain.apply(self, arguments);

        // List of devices that have BULKIO Output Ports discovered by this Domain
        self.bulkioDevices = [];
        self._oneshot = true;

        self.getBulkioDeviceIndex = function(id) {
          for (var i=0; i < self.bulkioDevices.length; i++) {
            if (id == self.bulkioDevices[i].id)
              return i;
          }
          return -1;
        }

        self.getBulkioDevice = function(id) {
          var i = self.getBulkioDeviceIndex(id);
          if (-1==i)
            return undefined;
          else
            return self.bulkioDevices[i];
        }
      }
      DomainWrapper.prototype = Object.create(RedhawkDomain.prototype);
      DomainWrapper.prototype.constructor = DomainWrapper;

      // First update we run through the deviceManagers list to check for devices.
      DomainWrapper.prototype._updateFinished = function () {
        var self = this;
        if (self._oneshot) {
          self._oneshot = false;
          angular.forEach(self.deviceManagers, function (manager) {
            processDeviceManager.call(self, manager.id);
          });
        }
      }

      // Tap the message stream to maintain the list of devices after the first init.
      DomainWrapper.prototype.on_msg = function(message) {
        var self = this;
        $timeout(function() { 
          var adding = message.event.hasOwnProperty('sourceIOR');
          if (message.event.hasOwnProperty('sourceCategory')) {
            switch (message.event.sourceCategory.value) {
              case 'DEVICE_MANAGER':
                if (adding)
                  processDeviceManager.call(self, message.event.sourceId);
                break;
    
              case 'DEVICE':
                if (!adding)
                  removeBulkioDevice.call(self, message.event.sourceId);
                break;

              default:
                break;
            }
          }
        }, 2000); // Slight delay for server model to catch up with events.
      }

      /**
       * NOTE: This is one way to have private methods in a factory.  Note the two 
       *       calls within on_msg, above, use 'call(self, ...)' to pass the instance
       *       into the private method.
       */
      var processDeviceManager = function(managerId) {
        var self = this; // Will be the DomainWrapper instance.
        var manager = self.getDeviceManager(managerId);
        manager.$promise.then(function() {
          angular.forEach(manager.devices, function(device) {
            addBulkioDevice.call(self, device.id, managerId);
          });
        });
      }

      /**
       * Create a RedhawkDevice and check its ports to see if any "canPlot"
       */
      var addBulkioDevice = function(deviceId, managerId) {
        var self = this; // Will be the DomainWrapper instance.
        var device = self.getDevice(deviceId, managerId);
        device.$promise.then(function() {
          for (var i=0; i < device.ports.length; i++) {
            if (device.ports[i].canPlot && !self.getBulkioDevice(deviceId)) {
              self.bulkioDevices.push(device); 
              console.debug('Bulkio Device Discovered: ' + deviceId);
              break;
            }
          }
        });
      }

      /**
       * Find the device and remove it (splice) from the list.
       */ 
      var removeBulkioDevice = function(deviceId) {
        var self = this; // Will be the DomainWrapper instance.
        var i = self.getBulkioDeviceIndex(deviceId);
        if (-1 < i)
          self.bulkioDevices.splice(i, 1);
      }

      return DomainWrapper;
  }])

  .controller('ExampleController', 
    ['$scope', '$modal', '$timeout', 'Redhawk', 'user', 'DomainWrapper', 'RedhawkSocket',
    function($scope, $modal, $timeout, Redhawk, user, DomainWrapper, RedhawkSocket) {
      // Attach to to the first redhawk domain ID found, create and assign it to
      // a property on $scope to make it accessible from the views/example.html
      $scope.user = user;
      $scope.$watch('user.domain', function(domainId) {
        if (domainId) {
          $scope.domain = Redhawk.getDomain(domainId, 'DomainWrapper');
        }
      });

      // Once bulkio-providing devices  are discovered, select the first one to get started.
      $scope.selectedDevice = undefined;
      $scope.$watchCollection('domain.bulkioDevices', function(devices) {
        if (!$scope.selectedDevice && devices && devices.length) {
          $scope.selectedDevice = devices[0];
        }
      });

      // When a device is selected, select the first interface as the port to view
      $scope.selectedInterfaceSocket = undefined;
      $scope.selectedInterfaceData = undefined;
      $scope.selectedInterfaceSRI = undefined;
      $scope.disableSelection = false;

      $scope.plotInterface = function(interface) {
        // Debounce the two select panel to give a shot at the plot starting.
        $scope.disableSelection = true;
        $timeout(function() { $scope.disableSelection = false; }, 5000);

        stopPlotting();

        if ("" == interface || null == interface) {
          $scope.selectedInterfaceSRI = undefined;
          $scope.selectedInterfaceData =  undefined;
          return;
        }

        /*
        TODO: Make this whole interface to the directive be based on a Resource_impl and 
              a port name.  If no name is present, provide a listing of ports (ng-show).
        */
        $scope.selectedInterfaceSocket = RedhawkSocket.port(
          { // Options defined in RedhawkServices -> RedhawkSocket factory
            domain        : $scope.selectedDevice.domainId, 
            deviceManager : $scope.selectedDevice.deviceManager.id, 
            device        : $scope.selectedDevice.id, 
            port          : interface.name
          },
          function (data) {
            $scope.selectedInterfaceData = data;
          },
          function (sri) {
            $scope.selectedInterfaceSRI = sri;
          }
        );
      }

      var stopPlotting = function() {
        if (!!$scope.selectedInterfaceSocket) {
          $scope.selectedInterfaceSocket.close();
          $scope.selectedInterfaceSocket = undefined;
        }
      }

      // If the controller closes/is removed, be nice and shut down the socket.
      $scope.$on("$destroy", function() {
        stopPlotting();
      })

      $scope.bulkioFilter = function (port) {
        return (port.canPlot);
      }

  }])

;