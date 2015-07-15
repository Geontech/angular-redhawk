/*
 * This file is protected by Copyright. Please refer to the COPYRIGHT file
 * distributed with this source distribution.
 *
 * This file is part of Angular-REDHAWK.
 *
 * Angular-REDHAWK is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Angular-REDHAWK is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 */

  
/**
 * Angular-REDHAWK Device extension specifically useful for Devices that are known to 
 * have an FEI *Tuner Provides interface.
 */
angular.module('redhawk')
  .factory('FEITunerDevice', ['Device', 'REST', 
    function(Device, REST) {
      var FEITunerDevice = function() {
        var self = this;
        Device.apply(self, arguments);

        ///////// Additional public interfaces (immutable) //////////
        self.feiQuery = feiQuery;
        self.feiTune = feiTune;
        self.getTunerAllocationProps = getTunerAllocationProps;
        self.getListenerAllocationProps = getListenerAllocationProps;



        //////// Definitions ///////////


        /* 
         * Gets a copy of the REDHAWK Property ID for tuner_allocation
         */
        function getTunerAllocationProps  () {
          var p = UtilityFunctions.findPropId(self.properties, 'FRONTEND::tuner_allocation');
          return angular.copy(p);
        }

        /* 
         * Gets a copy of the REDHAWK Property ID for listener_allocation
         */
        function getListenerAllocationProps  () {
          var p = UtilityFunctions.findPropId(self.properties, 'FRONTEND::listener_allocation');
          return angular.copy(p);
        }

        // Returns a promise, allocatioNId is optional.
        function feiQuery (portId, allocationId) {
          return REST.feiTunerDevice.query(
            angular.extend({}, self._restArgs, {allocationId: allocationId, portId: portId}),
            function(data) {
              angular.forEach(self.ports, function(port) {
                if (port.name == data.name) {
                  if (port.active_allocation_ids) {
                    // data is the FEITuner structure w/ an updated allocation ID list and no id-keys filled.
                    // Find the port and remove any invalid allocation ids, then extend to update valid ones.
                    var oldIDs = UtilityFunctions.filterOldList(port.active_allocation_ids, data.active_allocation_ids);
                    for (var i=0; i < oldIDs.length; i++) {
                      delete port[oldIDs[i]];
                    }
                  }
                  angular.extend(port, data);
                }
              }); 
            }
          ).$promise;
        };

        // Returns a promise
        function feiTune (portId, allocationId, properties) {
          return REST.feiTunerDevice.tune(
              angular.extend({}, self._restArgs, { allocationId: allocationId, portId: portId }),
              {properties: properties},
              function () { return self.feiQuery(portId, allocationId); }
          );
        };
      }

      FEITunerDevice.prototype = Object.create(Device.prototype);
      FEITunerDevice.prototype.constructor = FEITunerDevice;

      return FEITunerDevice;
    }])
;
