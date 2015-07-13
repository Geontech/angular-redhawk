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
 angular.module('redhawk.rest', ['ngResource'])
  /*
   * Top-level REST factory encapsulating the basic behaviors such as _update and
   * the processing of _runAllUpdatesFinished.  Externally, it provides the updateFinished
   * list of callbacks which are executed in reverse order (highest index first).  If any
   * callback returns `false`, it is removed from the list, making one-shots available
   * even to extended factories.
   */
  .factory('RESTFactory', 
    function() {
      var RESTFactory = function() {
        var self = this;

        /* 
         * List of callback methods that will be executed last to first
         * Methods should return true to remain in the list.
         * Methods that return false will be removed from the list.
         */
        self.updateFinished = [];


        ///////// Internal /////////


        /*
         * Runs through the updateFinished methods.  Any that return false are removed from the list.
         * TODO: Incorporate this behavior into a base class for all factories.
         */
        self._runAllUpdatesFinished = function() {
          var f = self.updateFinished.length;
          while (f--) {
            if (!self.updateFinished[f]())
              self.updateFinished.splice(f, 1);
          }
        }

        self._update = function(updateData) {
          if (!!updateData) {
              angular.extend(self, updateData);
              _runAllUpdatesFinished();
          }
        }
      }

      /* 
       * INTERNAL to the implementation factory.
       * Map of arguments used in in the implementation factory's REST callbacks
       */
      RESTFactory.prototype._restArgs = {};

      return RESTFactory;
    })

  /*
   * Top-level REST factory child that has a 'ports' list in its REST model
   */
  .factory('RESTPortBearer', ['RESTFactory', 'Config', 'InterpolateUrl',
    function(RESTFactory, Config, InterpolateUrl) {
      var RESTPortBearer = function () {
        var self = this;
        RESTFactory.apply(arguments);

        // Add the _processPorts method to the list of updateFinished methods.
        self.updateFinished.push(function() { _processPorts.call(self); });


        ///////// INTERNAL //////////

        /**
         * Tags ports with extra fields indicating if each is
         * a BULKIO Output or Frontend Interface Provides port.
         */
        var _processPorts = function() {
          var self = this;

          // Prep the base url and args for interpolation.
          var socketUrl = Config.websocketUrl + self._portConfigUrl;
          var configArgs = angular.extend({}, self._restArgs, { portId: '' });

          var bulkioCheck = function(port) {
            var portDataTypeRegex = /^data(.*)$/;
            var matches = portDataTypeRegex.exec(port.idl.type);
            if(matches) {
              port.canPlot = port.direction == "Uses" && port.idl.namespace == "BULKIO";
              if(port.canPlot) {
                port.plotType = matches[1].toLowerCase();
                configArgs.portId = port.id;
                port.bulkioUrl = InterpolateUrl(socketUrl, configArgs) + '/bulkio';
              }
            } else {
              port.canPlot = false;
            }
          }

          var feiCheck = function (port) {
            if ("FRONTEND" == port.idl.namespace && "Provides" == port.direction) {
              port.canFeiQuery = true;
              port.canFeiTune = ("AnalogTuner" == port.idl.type || "DigitalTuner" == port.idl.type);
            }
            else {
              port.canFeiQuery = false;
              port.canFeiTune = false;
            }
          }

          // Process each.
          angular.forEach(self.ports, function(port) {
            bulkioCheck(port);
            feiCheck(port);
          });

          return false; // Run once.
        }
      }

      // Implement the parent factory.
      RESTPortBearer.prototype = Object.create(RESTFactory.prototype);
      RESTPortBearer.prototype.constructor = RESTPortBearer;

      // Base Config.??PortUrl used for the ports on the implemented factory
      // INTERNAL to the implementation.
      RESTPortBearer.prototype._portConfigUrl = '';

      return RESTPortBearer;
    }])
 ;