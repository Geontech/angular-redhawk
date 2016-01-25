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
 * Angular-REDHAWK Device extension that is known to have an FEI Provides interface port.
 *
 * In other words, if you know the Device has an FEI port, use the Domain's method 
 * getDevice(id, deviceManagerID, 'FEIDevice') to gain the extra feiQuery method
 * for accessing those specialized structures.
 * 
 * If the device is known to provide an FEI Tuner interface, use the FEITunerDevice
 * instead; it provides more appropriate methods for managing tuners.
 */
angular.module('redhawk')
  .factory('FEIDevice', ['Device', 'REST',
    function(Device, REST) {
      var FEIDevice = function() {
        var self = this;
        Device.apply(self, arguments);

        //////// PUBLIC Interfaces ////////
        self.feiQuery = feiQuery;



        //////// Definitions /////////
        // Returns a promise
        function feiQuery (portId) {
          return REST.feiDevice.query(
            angular.extend({}, self._restArgs, { portId: portId }),
            function(data) { 
              angular.forEach(self.ports, function(port) {
                if (port.name == data.name)
                  angular.extend(port, data);
              }); 
            }
          ).$promise;
        };
      }

      FEIDevice.prototype = Object.create(Device.prototype);
      FEIDevice.prototype.constructor = FEIDevice;

      return FEIDevice;
    }])
;