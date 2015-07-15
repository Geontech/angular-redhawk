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


/*
  Extendable Angular-REDHAWK factory represents a single DeviceManager instance.

  An instance, or its extension, can be retrieved from a REDHAWK Domain instance
  using the getDeviceManager(id, <extension name>) method.
 */
angular.module('redhawk')
  .factory('DeviceManager', ['REST', 'RESTFactory',
    function (REST, RESTFactory) {
      var DeviceManager = function(id, domainId) {
        var self = this;

        // Inherited Setup
        RESTFactory.apply(arguments);

        //////// PUBLIC Interfaces (immutable) ///////////
        self.refresh = refresh;

        //////// Definitions /////////
        

        function refresh () { _reload(); }


        //////// Internal /////////
        

        /**
         * @see {Domain._load()}
         */
        var _load = function(id, domainId) {
          self._restArgs = { managerId: id, domainId: domainId };
          self.$promise = REST.deviceManager.query(self._restArgs, 
            function(data) {
              self.id = id;
              self.domainId = domainId;
              self._update(data);
            }).$promise;
        }

        /**
         * @see {Domain._reload()}
         */
        var _reload = function() { _load(self.id, self.domainId); }

        _load(id, domainId);
      };

      DeviceManager.prototype = Object.create(RESTFactory.prototype);
      DeviceManager.prototype.constructor = DeviceManager;
      return DeviceManager;
  }])

;