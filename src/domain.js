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
  Extendable Angular-REDHAWK factory represents a single Domain instance.

  Use the REDHAWK service getDomain(id) method to get an instance of this
  factory, or extend this factory, and retrieve it also using the REDHAWK
  service: 
    getDomain(id, extensionName);
 */
angular.module('redhawk')
  .factory('Domain', ['$injector', 'EventChannel', 'NotificationService', 'REST', 'RESTFactory', 'DeviceManager', 'Device', 'Waveform', 'Component',
    function($injector, EventChannel, NotificationService, REST, RESTFactory, DeviceManager, Device, Waveform, Component) {
      var Domain = function(id) {
        var self = this;

        // Inherited Setup
        RESTFactory.apply(self, arguments);

        ///////// PUBLIC (immutable) //////////
        self.refresh = refresh;
        self.configure = configure;
        self.getFileSystem = getFileSystem;
        // Getting Device Managers and Devices
        self.getDeviceManager = getDeviceManager;
        self.getDevice = getDevice;
        // Launching and getting Waveforms, Components.
        self.getLaunchableWaveforms = getLaunchableWaveforms;
        self.launch = launch;
        self.getWaveform = getWaveform;
        self.getComponent = getComponent;

        // Event Channel access
        self.events = []; // buffer
        self.addEventChannel = addEventChannel;
        self.removeEventChannel = removeEventChannel;
        self.getChannelNames = getChannelNames;

        //////// PUBLIC (mutable) /////////
        // on_msg -- Replace with a function to call when event channel messages are received
        // on_connect -- Replace with a function to call when the event channel connects



        ///////// Definitions ////////

        /**
         * Refresh the REST model
         */
        function refresh() { _reload(); }

        /**
         * Configure REDHAWK properties for this object.
         * @param properties
         */
        function configure (properties) {
          REST.domain.configure(self._restArgs, { properties: properties });
        };

        /**
         * Gets filesystem information at path.
         * @deprecated - Not implemented in current versions of the backend
         * @param path
         * @returns {*}
         */
        function getFileSystem (path) {
          return REST.fileSystem.query( angular.extend({}, self._restArgs, { path: path }) );
        };

        /**
         * Get a device manager object from this domain.
         * @param id
         * @param factoryName
         * @returns {*}
         */
        function getDeviceManager (id, factoryName) {
          var storeId = id + ((factoryName) ? factoryName : 'DeviceManager');
          if(!self.deviceManagers[storeId]) {
            var constructor = (factoryName) ? $injector.get(factoryName) : DeviceManager;
            self.deviceManagers[storeId] = new constructor(id, self.name);
          }
          return self.deviceManagers[storeId];
        };

        /**
         * Get a device object from this domain.
         * @param id
         * @param deviceManagerId
         * @param factoryName
         * @returns {*}
         */
        function getDevice (id, deviceManagerId, factoryName) {
          var storeId = id + ((factoryName) ? factoryName : 'Device');
          if(!self.devices[storeId]){
            var constructor = (factoryName) ? $injector.get(factoryName) : Device;
            self.devices[storeId] = new constructor(id, self.name, deviceManagerId);
          }

          return self.devices[storeId];
        };

        /**
         * Get a list of Waveforms available for launching.
         * @returns {Array}
         */
        function getLaunchableWaveforms () {
          if(!self.availableWaveforms) {
            self.availableWaveforms = [];
            self.availableWaveforms.$promise =
              REST.waveform.status(self._restArgs).$promise
                .then(function(data){
                  angular.forEach(data.waveforms, function(item){
                    this.push(item.name);
                  }, self.availableWaveforms);

                  return self.availableWaveforms;
                });
          }

          return self.availableWaveforms;
        };

        /**
         * Launch a Waveform.
         * @param name
         * @returns {*}
         */
        function launch (name) {
          return REST.waveform.launch(self._restArgs, { name: name },
            function(data){
              notify.success("Waveform "+data['launched']+" launched");
              _reload();
            },
            function(){
              notify.error("Waveform "+name+" failed to launch.");
            }
          );
        };

        /**
         * Get a waveform object from this domain.
         * @param id
         * @param factoryName
         * @returns {*}
         */
        function getWaveform (id, factoryName){
          var storeId = id + ((factoryName) ? factoryName : 'Waveform');
          if(!self.waveforms[storeId]) {
            var constructor = (factoryName) ? $injector.get(factoryName) : Waveform;
            self.waveforms[storeId] = new constructor(id, self.name);
          }

          return self.waveforms[storeId];
        };
        
        /**
         * Get a component object from this domain.
         * @param id
         * @param applicationId
         * @param factoryName
         * @returns {*}
         */
        function getComponent (id, applicationId, factoryName) {
          var storeId = id + ((factoryName) ? factoryName : 'Component');
          if(!self.components[storeId]) {
            var constructor = (factoryName) ? $injector.get(factoryName) : Component;
            self.components[storeId] = new constructor(id, self.name, applicationId);
          }

          return self.components[storeId];
        };

        /**
         * Add the named event channel to the list of subscriptions.
         */
        function addEventChannel (name) {
          if (!!eventChannel)
            eventChannel.addChannel(name);
        }

        /**
         * Remove the named event channel from the list of subscriptions.
         */
        function removeEventChannel (name) {
          if (!!eventChannel)
            eventChannel.removeChannel(name);
        }

        /**
         * Get a list of active channel names on the eventChannel socket
         */
        function getChannelNames () {
          if (!!eventChannel)
            return eventChannel.getChannelNames();
          else
            return [];
        }


        ///////// Internal //////////

        // For pushing notifications to the UI when a waveform is launched.
        var notify = NotificationService;

        // Event Channel Socket
        var eventChannel = null;

        /**
         * Handles loading data from the REST interface.
         * @param id
         * @private
         */
        var _load = function(id) {
          self._restArgs = { domainId: id };
          self.name = id;

          // Event socket.
          if (!eventChannel)
            eventChannel = new EventChannel(id, self.events, _on_msg, _on_connect);

          // Local storage maps of spawned factories.
          self.deviceManagers = {};
          self.waveforms = {};
          self.components = {};
          self.devices = {};

          self.$promise = REST.domain.info(self._restArgs,
            function(data) {
              self._update(data);
            }).$promise;
        };

        /**
         * Reloads the data based on existing identifiers.
         * @private
         */
        var _reload = function() { _load(self.name); };

        /**
         * Internal calback for event channel on_msg
         */
        var _on_msg = function (msg) {
          // TODO: Process the message to update the model and spawned factories
          // Forward the message to the spawned factory (if it exists)?
          // Automatically spawn and tear-down factories?
          
          // Finally, call the overloaded on_msg (below)
          if (self.on_msg)
            self.on_msg(msg);
        }

        /**
         * Internal callback for event channel on_connect
         */
        var _on_connect = function () {
          eventChannel.addChannel('IDM_Channel');
          eventChannel.addChannel('ODM_Channel');
          // TODO: Add automatic sweep through REST model for device managers and 
          // applications of interest (if they're online) and spawn those factories.
          // similar to how the examples do it.
          if (self.on_connect)
            self.on_connect();
        }

        _load(id);
      };

      Domain.prototype = Object.create(RESTFactory.prototype);
      Domain.prototype.constructor = Domain;

      // EXTERNAL : EventChannel callbacks
      // Set these to your callbacks to be notified in each case.
      Domain.prototype.on_connect = undefined;
      Domain.prototype.on_msg = undefined;

      return Domain;
  }])
;
