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
  Extendable Angular-REDHAWK factory represents a single Waveform instance.

  An instance, or its extension, can be retrieved from a REDHAWK Domain instance
  using the getWaveform(id, <extension name>) method.
 */
angular.module('redhawk')
  .factory('Waveform', ['Config', 'REST', 'RESTPortBearer', 'NotificationService',
    function(Config, REST, RESTPortBearer, NotificationService) {
      var Waveform = function(id, domainId) {
        var self = this;

        // Inherited setup
        RESTPortBearer.apply(arguments);
        self._portConfigUrl = Config.waveformPortUrl;

        //////// PUBLIC Interfaces (immutable) /////////
        // Methods
        self.start = start;
        self.stop = stop;
        self.release = release;
        self.configure = configure;


        //////// Definitions ////////

        /**
         * Start the Waveform
         * @returns {*}
         */
        function start () {
          return REST.waveform.update(self._restArgs, {started: true},
            function() {
              notify.success("Waveform "+self.REST.name+" started.");
              _reload();
            },
            function() {
              notify.error("Waveform "+self.REST.name+" failed to start.")
            }
          );
        }

        /**
         * Stop the Waveform
         * @returns {*}
         */
        function stop () {
          return REST.waveform.update( self._restArgs, {started: false},
            function() { 
              notify.success("Waveform "+self.name+" stopped.");
              _reload();
            },
            function() {  
              notify.error("Waveform "+self.name+" failed to stop.");
            }
          );
        }

        /**
         * Release (delete) the Waveform
         * @returns {*}
         */
        function release () {
          return REST.waveform.release( self._restArgs, {},
            function() { notify.success("Waveform "+self.name+" released.");        },
            function() { notify.error("Waveform "+self.name+" failed to release."); }
          );
        }

        /**
         * @see {Domain.configure()}
         */
        function configure (properties) {
          return REST.waveform.configure(self._restArgs, {properties: properties});
        }

        //////// Internal ////////


        // Service for popping up indications when the waveform changes state
        var notify = NotificationService;

        /**
         * @see {Domain._load()}
         */
        function _load (id, domainId) {
          self._restArgs = { applicationId: id, domainId: domainId };
          self.$promise = REST.waveform.query(self._restArgs, 
            function(data){
              self.id = id;
              self.domainId = domainId;
              self._update(data);
            }).$promise;
        }

        /**
         * @see {Domain._reload()}
         */
        function _reload () { _load(self.id, self.domainId); }

        _load(id, domainId);
      };

      Waveform.prototype = Object.create(RESTPortBearer.prototype);
      Waveform.prototype.constructor = Waveform;
      return Waveform;
    }
  ])
;