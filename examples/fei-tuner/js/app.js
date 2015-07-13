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

angular.module('FeiTunerApp', [
    'ui.bootstrap',
    'ngRoute',
    'RedhawkServices' 
  ])

  // Route configuration to load views into our single-page app
  .config(['$routeProvider', 
    function ($routeProvider) {
      $routeProvider
        .when('/example', {
            templateUrl: 'views/example.html',
            controller: 'FeiTunerController'
        })
        .otherwise({ redirectTo: '/example' });
    }
  ])

  /** 
   * Example of wrapping the RedhawkDomain to tap directly into the message stream.
   * Here, we'll follow DEVICE_MANAGER's coming online to check for devices that can be tuned.
   * creating a RedhawkFeiTunerDevice instance for each.
   */
  .factory('DomainWrapper', ['RedhawkDomain', '$timeout',
    function(RedhawkDomain, $timeout) {
      var DomainWrapper = function () {
        var self = this;
        RedhawkDomain.apply(self, arguments);

        // List of tuners discovered by this Domain
        self.tuners = [];
        self._oneshot = true;

        self.getTunerIndex = function(id) {
          for (var i=0; i < self.tuners.length; i++) {
            if (id == self.tuners[i].id)
              return i;
          }
          return -1;
        }

        self.getTuner = function(id) {
          var i = self.getTunerIndex(id);
          if (-1==i)
            return undefined;
          else
            return self.tuners[i];
        }
      }
      DomainWrapper.prototype = Object.create(RedhawkDomain.prototype);
      DomainWrapper.prototype.constructor = DomainWrapper;

      // First update we run through the deviceManagers list to check for tuners.
      DomainWrapper.prototype._updateFinished = function () {
        var self = this;
        if (self._oneshot) {
          self._oneshot = false;
          angular.forEach(self.deviceManagers, function (manager) {
            processDeviceManager.call(self, manager.id);
          });
        }
      }

      // Tap the message stream to maintain the list of tuners after the first init.
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
                  removeTuner.call(self, message.event.sourceId);
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
            addTuner.call(self, device.id, managerId);
          });
        });
      }

      /**
       * Harmlessly caches a default Device to read its port information.
       * If a port is both tunable and queryable, the Device is stored as
       * a RedhawkFeiTunerDevice instance. 
       */
      var addTuner = function(deviceId, managerId) {
        var self = this; // Will be the DomainWrapper instance.
        var device = self.getDevice(deviceId, managerId);
        device.$promise.then(function() {
          for (var i=0; i < device.ports.length; i++) {
            if (device.ports[i].canFeiQuery && device.ports[i].canFeiTune && !self.getTuner(deviceId)) {
              self.tuners.push(self.getDevice(deviceId, managerId, 'RedhawkFeiTunerDevice'));
              console.debug('Tuner Discovered: ' + deviceId);
              break;
            }
          }
        });
      }

      /**
       * Find the tuner and remove it (splice) from the tuners list.
       */ 
      var removeTuner = function(deviceId) {
        var self = this; // Will be the DomainWrapper instance.
        var i = self.getTunerIndex(deviceId);
        if (-1 < i)
          self.tuners.splice(i, 1);
      }

      return DomainWrapper;
  }])

  .controller('FeiTunerController', ['$scope', '$modal', '$timeout', 'Redhawk', 'user', 'DomainWrapper',
    function($scope, $modal, $timeout, Redhawk, user, DomainWrapper) {
      // Attach to to the first redhawk domain ID found, create and assign it to
      // a property on $scope to make it accessible from the views/example.html
      $scope.user = user;
      $scope.$watch('user.domain', function(domainId) {
        if (domainId) {
          $scope.domain = Redhawk.getDomain(domainId, 'DomainWrapper');
        }
      });

      // Once tuners are discovered, select the first one to get started.
      $scope.selectedDevice = undefined;
      $scope.$watchCollection('domain.tuners', function(tuners) {
        if (!$scope.selectedDevice && tuners && tuners.length) {
          $scope.selectedDevice = tuners[0];
        }
      });

      // When a tuner is selected, select the first interface as the port to view
      $scope.selectedInterface = undefined;
      $scope.$watchCollection('selectedDevice.ports', function (ports) {
        if (ports && ports.length) {
          for (var i=0; i < ports.length; i++) {
            if ($scope.feiFilter(ports[i])) {
              $scope.selectedInterface = ports[i];

              // Query for initial FEI details.
              $scope.selectedDevice.feiQuery($scope.selectedInterface.name)
                .then(function(result) {
                  return result;
                });
              break;
            }
          }
        }
      });

      // When the interface is selected, pick an allocation ID.
      $scope.selectedAllocationId = undefined;
      $scope.selectedAllocation = undefined;
      $scope.$watchCollection('selectedInterface.active_allocation_ids', function(allocationIds) {
        if (allocationIds && allocationIds.length) {
          $scope.selectedAllocationId = allocationIds[0];
          $scope.allocationIdChanged();
        }
      });

      $scope.allocationIdChanged = function () {
        // Query for the allocation ID to populate the 'allocations' array, if found.
        $scope.selectedDevice.feiQuery($scope.selectedInterface.name, $scope.selectedAllocationId);
      }

      $scope.$watchCollection('selectedInterface.allocations', function(allocations) {
        if (allocations && allocations.length) {
          var idx = -1;
          for (var i=0; i < allocations.length; i++) {
            if ($scope.selectedAllocationId == allocations[i].id) {
              $scope.selectedAllocation = allocations[i];
              return;
            }
          }
        }
        // Not found, clear variable.
        $scope.selectedAllocation = undefined;
      });

      $scope.allocationCreator = function() {
        var stat = angular.copy($scope.selectedInterface.tuner_statuses);
        var templates = {
          tuner:    $scope.selectedDevice.getTunerAllocationProps(),
          listener: $scope.selectedDevice.getListenerAllocationProps()
        }
        var info = {
          id: '', 
          properties: [],
          templates: templates,
          statuses: stat,
        };

        var panel = $modal.open({
            templateUrl:  'templates/allocationPanel.html',
            controller:   'allocationPanel',
            size:         'lg',
            resolve: {
              info: function () {
                return info;
              }
            }
          });

        panel.result.then(
          function(result) {
            /* Attempt allocation.  Timeout, queryFEI for the ID */
            $scope.selectedDevice.allocate([result.properties]);
            $timeout(function() {
              $scope.selectedAllocationId = result.id; // Triggers redraw via affected $watch's.
            }, 2000);

          },
          function() { /* Cancelled */ }
        );
      }

      $scope.tune = function(properties) {
        $scope.selectedDevice.feiTune($scope.selectedInterface.name, $scope.selectedAllocationId, properties);
      }

      $scope.feiFilter = function (port) {
        return (port.canFeiQuery && port.canFeiTune);
      }
  }])

  .controller('allocationPanel', function($scope, $modalInstance, info) {
    $scope.info = info;
    $scope.showStatuses = (info.statuses.length > 0);
    $scope.TYPES = [
      {text: 'Tuner',    value: true },
      {text: 'Listener', value: false }
    ];

    $scope.allocationTypeIsTuner = true;
    $scope.$watch('allocationTypeIsTuner', function(aType) {
      $scope.properties = ($scope.allocationTypeIsTuner) ? 
        $scope.info.templates.tuner : 
        $scope.info.templates.listener;
    });

    $scope.prettyId = function(id) {
      return id.replace(/^(\w+::){2}/, '');
    }

    // FIXME: Back in the server-side, modify the property helper to give scaTypes
    //        and enumerations to the fields of structs, structSeq, etc., then tweak here
    //        and admin console to make this (so much) cleaner.
    var typesAndEnums = {
        'FRONTEND::tuner_allocation::tuner_type'                : {scaType: 'enum', enumerations: ['TX', 'RX', 'CHANNELIZER', 'DDC', 'RX_DIGITIZER', 'RX_DIGITIZER_CHANNELIZER']},
        'FRONTEND::tuner_allocation::allocation_id'             : {scaType: 'text'},
        'FRONTEND::tuner_allocation::center_frequency'          : {scaType: 'number'},
        'FRONTEND::tuner_allocation::bandwidth'                 : {scaType: 'number'},
        'FRONTEND::tuner_allocation::bandwidth_tolerance'       : {scaType: 'number'},
        'FRONTEND::tuner_allocation::gain'                      : {scaType: 'number'},
        'FRONTEND::tuner_allocation::sample_rate'               : {scaType: 'number'},
        'FRONTEND::tuner_allocation::sample_rate_tolerance'     : {scaType: 'number'},
        'FRONTEND::tuner_allocation::device_control'            : {scaType: 'enum', enumerations: [true, false]},
        'FRONTEND::tuner_allocation::group_id'                  : {scaType: 'text'},
        'FRONTEND::tuner_allocation::rf_flow_id'                : {scaType: 'text'},
        'FRONTEND::listener_allocation::existing_allocation_id' : {scaType: 'text'},
        'FRONTEND::listener_allocation::listener_allocation_id' : {scaType: 'text'},
    }
    $scope.typeForPropId = function(id) {
      return typesAndEnums[id].scaType;
    }
    $scope.enumForPropId = function(id) {
      return typesAndEnums[id].enumerations;
    }

    $scope.submit = function () {
      info.properties = $scope.properties;
      if ($scope.allocationTypeIsTuner) {
        info.id = info.properties.value["FRONTEND::tuner_allocation::allocation_id"];
      }
      else {
        info.id = info.properties.value["FRONTEND::listener_allocation::listener_allocation_id"];
      }

      $modalInstance.close(info);
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    }
  })

  .directive('tuningPanel',function() {
    return {
      restrict: 'E',
      scope: {
        tuningStruct: "=", // Reference to the tuning structure
        submit:       "&", // Calls for an allocation of properties
      },  
      templateUrl: 'templates/tuningPanel.html',
      controller: function ($scope) { 
        // tuningStruct is {id: someId, value: [properties]}
        $scope.$watch('tuningStruct', function(tuningStruct) {
          for (var i=0; i<tuningStruct.value.length; i++){
            if ('tuner_device_control' == tuningStruct.value[i].id) {
              $scope.canEdit = tuningStruct.value[i].value;
            }
            else if ('tuner_status' == tuningStruct.value[i].id) {
              $scope.tunerStatus = tuningStruct.value[i].value;
            }
          }
        });

        // Internal list of any changes made within the panel.
        var changes = [];

        $scope.showProp = function(prop) {
          if ('tuner_status' == prop.id)
            return false;
          return true;
        }

        $scope.changedProp = function (prop) { 
          if (-1 == changes.indexOf(prop))
            changes.push(prop);
        }

        $scope.doSubmit = function() {
          console.debug(changes);
          if (0 < changes.length)
            $scope.submit()(changes);
          else
            alert('No changes made.');
        }

        $scope.propType = function(prop) {
          var t = undefined
          switch (prop.id) {
            case 'tuner_center_frequency' :
            case 'tuner_bandwidth' :
            case 'tuner_gain' :
            case 'tuner_reference_source' :
            case 'tuner_output_sample_rate':
              t = 'number';
              break;

            case 'tuner_agc_enable' :
            case 'tuner_enable' :
              t = 'boolean';
              break;

            default:
              break;
          }
          return t;
        }


        $scope.propIsEditable = function(prop) {
          switch (prop.id) {
            case 'tuner_center_frequency' :
            case 'tuner_bandwidth' :
            case 'tuner_agc_enable' :
            case 'tuner_gain' :
            case 'tuner_reference_source' :
            case 'tuner_enable' :
            case 'tuner_output_sample_rate':
              return ($scope.canEdit && 'NOT_SUPPORTED' != prop.value);
              break;

            default:
              return false;
              break;
          }
        }
      }
    }
  })
  
  /* 
   * Simple directive for displaying the tuner_status structure as a list of cleaned-up (prettyId)
   * ID-Value pairs useful for cross-referencing tuning parameters.
   */
  .directive('tunerStatus', function () {
    return {
      restrict: 'E',
      scope: {
        status: "=", // Reference to the tuning structure
      },  
      templateUrl: 'templates/tunerStatus.html',
      controller: function ($scope) {
        $scope.prettyId = function(id) {
          return id.replace(/^(\w+::){2}/, '');
        }
      }
    }
  })
;