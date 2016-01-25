angular.module('SigPlotApp', [
    'ui.bootstrap',
    'ngRoute',
    'redhawk'
  ])

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
   * Example of wrapping the Domain to tap directly into the message stream.
   * Here, we'll follow DEVICE_MANAGER's coming online to check for devices that 
   * streamed to the sigplot instance, and creating a default Device instance 
   * for each.
   */
  .factory('DomainWrapper', ['Domain', '$timeout',
    function(Domain, $timeout) {
      var DomainWrapper = function () {
        var self = this;
        Domain.apply(self, arguments);

        // List of devices that have BULKIO Output Ports discovered by this Domain
        self.bulkioDevices = [];

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

        // One-shot across the deviceManagers on the first query
        // to spawn factories for device managers that are already online.
        self.updateFinished.push(
          function () {
            angular.forEach(self.deviceManagers, function (manager) {
              processDeviceManager.call(self, manager.id);
            });

            return false;
          });
      }
      DomainWrapper.prototype = Object.create(Domain.prototype);
      DomainWrapper.prototype.constructor = DomainWrapper;

      // Tap the message stream to maintain the list of devices after the first init.
      DomainWrapper.prototype.on_msg = function(message) {
        var self = this;
        $timeout(function() { 
          var adding = message.hasOwnProperty('sourceIOR');
          if (message.hasOwnProperty('sourceCategory')) {
            switch (message.sourceCategory.value) {
              case 'DEVICE_MANAGER':
                if (adding)
                  processDeviceManager.call(self, message.sourceId);
                break;
    
              case 'DEVICE':
                if (!adding)
                  removeBulkioDevice.call(self, message.sourceId);
                break;

              default:
                break;
            }
          }
        }, 2000); // Slight delay for server model to catch up with events.
      }

      /**
       * NOTE: This is one way to have internal methods in a factory.  Note the two 
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
    ['$scope', '$modal', '$timeout', 'REDHAWK', 'DomainWrapper',
    function($scope, $modal, $timeout, REDHAWK, DomainWrapper) {
      // Attach to the first REDHAWK Domain found as a `DomainWrapper`
      // See examples/basic for a detailed explanation
      REDHAWK.addListener( 
        function(msg) {
          if (msg && msg.domains && msg.domains.length && !$scope.domain) {
            $scope.domain = REDHAWK.getDomain(msg.domains[0], 'DomainWrapper');            
          }
        });

      // Once bulkio-providing devices  are discovered, select the first one to get started.
      $scope.selectedDevice = undefined;
      $scope.$watchCollection('domain.bulkioDevices', function(devices) {
        if (!$scope.selectedDevice && devices && devices.length) {
          $scope.selectedDevice = devices[0];
        }
      });

      // Callback for selecting a port.
      $scope.selectedInterface = undefined;
      $scope.selectInterface = function (port) {
        $scope.selectedInterface = port;
      }
  }])

;