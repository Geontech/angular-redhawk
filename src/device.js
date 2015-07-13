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
  Extendable Angular-REDHAWK factory represents a single Device instance.

  An instance, or its extension, can be retrieved from a REDHAWK Domain instance
  using the getDevice(id, deviceManagerID, <extension name>) method.
 */
angular.module('redhawk')
  .factory('Device', ['$timeout', 'REST', 'RESTPortBearer',
    function ($timeout, REST, RESTPortBearer) {
      var Device = function(id, domainId, managerId) {
        var self = this;

        // Inherited setup
        RESTPortBearer.apply(arguments);
        self._portConfigUrl = Config.devicePortUrl;

        ///////// PUBLIC Interfaces /////////


        // lastSaveResponse corresponds to the server's last returned
        // message when using configure, allocate, or deallocate.
        self.lastSaveResponse = undefined;

        // Methods
        self.configure = configure;
        self.allocate = allocate;
        self.deallocate = deallocate;
        self.refresh = refresh;


        //////// Definitions //////////

        /*
         * Analogous to their names, pass an array of properties (id-value maps)
         * accordingly to set and un-set properties.
         */
        var configure = function(properties)  { return self._commonSave('configure',  properties); }
        var allocate = function(properties)   { return self._commonSave('allocate',   properties); }
        var deallocate = function(properties) { return self._commonSave('deallocate', properties); }

        /*
         * Refresh the REST model
         */
        var refresh = _reload;

        //////// Internal //////////
        /**
         * @see {Domain._load()}
         */
        var _load = function(id, domainId, managerId) {          
          self._restArgs = { deviceId: id, managerId: managerId, domainId: domainId };
          self.$promise = REST.device.query(self._restArgs, 
            function(data){
              self.id = id;
              self.deviceManagerId = managerId;
              self.domainId = domainId;
              self._update(data);
            }
          ).$promise;
        };

        /**
         * @see {Domain._reload()}
         */
        var _reload = function() { _load( self.id, self.domainId, self.deviceManagerId ); };

        /**
         * Save Property State method: Configure, Allocate, Deallocate
         * The lastSaveResponse can be used to see the server response (success, fail, etc.)
         */
        var _commonSave = function(method, properties) {
          return REST.device.save(self._restArgs, { method: method, properties: properties },
            function(response){ 
              $timeout(_reload, 1000);
              self.lastSaveResponse = response;
            }
          );
        };

        _load(id, domainId, managerId);
      }

      Device.prototype = Object.create(RESTPortBearer.prototype);
      Device.prototype.constructor = Device;

      return Device;
  }])
;