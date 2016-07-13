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
  Extendable Angular-REDHAWK factory represents a single Component instance.

  An instance, or its extension, can be retrieved from a REDHAWK Domain instance
  using the getComponent(id, appID, <extension name>) method.
 */
angular.module('redhawk')
  .factory('Component', ['$timeout', 'Config', 'REST', 'RESTPortBearer', 'Config',
    function ($timeout, Config, REST, RESTPortBearer, Config) {
      var Component = function(id, domainId, applicationId) {
        var self = this;

        // Inherited Setup
        RESTPortBearer.apply(self, arguments);
        self._portConfigUrl = Config.componentPortUrl;


        ///////// PUBLIC Interfaces (immutable) ///////////
        self.configure = configure;
        self.refresh = refresh;


        ///////// Definitions ////////////

        /**
         * Configure the list of properties (id-value pairs).
         */
        function configure (properties) {
          return REST.component.configure(self._restArgs, { properties: properties },
              function(){ $timeout(_reload, 1000); }
          );
        };

        /*
         * Refresh the REST model
         */
        function refresh (propMessage) {
          if (!!propMessage) 
            self._updateFromMessage(propMessage);
          else
            _reload(); 
        }


        ///////// Internal /////////////


        /**
         * @see {Domain._load()}
         */
        var _load = function(id, domainId, applicationId) {
          self._restArgs = {componentId: id, applicationId: applicationId, domainId: domainId };
          self.$promise = REST.component.query(self._restArgs,
            function(data){
              self.id = id;
              self.waveformId = applicationId;
              self.domainId = domainId;
              self._update(data);
            }).$promise;
        };

        /**
         * @see {Domain._reload()}
         */
        var _reload = function() { _load(self.id, self.domainId, self.waveformId); };

        _load(id, domainId, applicationId);
      };

      Component.prototype = Object.create(RESTPortBearer.prototype);
      Component.prototype.constructor = Component;
      return Component;
  }])  
  

;