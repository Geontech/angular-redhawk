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
  Extendable Angular-REDHAWK factory represents the REDHAWK infrastructure.

  The REDHAWK Service represents the underlying subsystems that support
  REDHAWK.  It can be used to discover and launch new domains as well as
  attach to event channels (IDM, ODM, named Message channels, etc.).

  Use enablePush() to connect to the domain watching websocket, and then
  (optionally) use addListener(callback) to receive notifications when
  domain-related messages are received.
 */
angular.module('redhawk')
  .service('REDHAWK', ['$injector', 'REST', 'Config', 'Subscription',
    function($injector, REST, Config, Subscription) {
      var redhawk = this;

      // PUBLIC Interfaces
      redhawk.domainIds = [];
      redhawk.getDomainIds = getDomainIds;
      redhawk.getDomain = getDomain;

      // For pushed updates
      redhawk.enablePush = enablePush;
      redhawk.disablePush = disablePush;
      redhawk.addListener = addListener;
      redhawk.removeListener = removeListener;


      ////////// DEFINITIONS BELOW ////////////

      /**
       *  Returns a list of REDHAWK Domains available.
       *
       * @returns {Array.<string>}
       */
      function getDomainIds () {
        if(!redhawk.domainIds) {
          redhawk.domainIds.$promise = REST.domain.query()
            .$promise
            .then(
              function(data){
                angular.forEach(data.domains, function(id) {
                  this.push(id);
                }, redhawk.domainIds);
                return redhawk.domainIds;
              }
            );
        }
        return redhawk.domainIds;
      };

      /**
       * Returns a resource with a promise to a {Domain} object.
       *
       * @param id - String ID of the domain
       * @param factoryName - String name to inject as the constructor rather than RedhawkDomain
       * @returns {Domain}
       */
      function getDomain (id, factoryName) {
        var storeId = id + ((factoryName) ? factoryName : 'Domain');

        if(!_domains[storeId]) {
          var constructor = (factoryName) ? $injector.get(factoryName) : $injector.get('Domain');
          _domains[storeId] = new constructor(id);
        }

        return _domains[storeId];
      };
      
      /**
       * Add a listener to the system's socket which carries information about Domains 
       * joining and leaving the networked REDHAWK system.
       */
      function addListener (callback) {
        if (!redhawkSocket) 
          redhawk.enablePush(); // Connect first...otherwise what's the point?

        // Forward the callback
        redhawkSocket.addJSONListener(callback);
      }

      /**
       * Remove a listener to the system's socket.
       */
      function removeListener (callback) {
        if (!redhawkSocket) return;
        redhawkSocket.removeJSONListener(callback);
      }

      /**
       * Enable pushed updates (via websocket)
       */
     function enablePush() {
        if (!redhawkSocket) {
          // Connect to the system-wide socket (domains joining and leaving);
          redhawkSocket = new Subscription();

          redhawkSocket.connect(Config.redhawkSocketUrl, 
            function () { 
              on_connect.call(redhawk); 
            });

          redhawkSocket.addJSONListener(
            function (msg) {
              on_msg.call(redhawk, msg);
            });
        }
      }

      /**
       * Disable pushed updates (via websocket);
       */
      function disablePush () {
        if (!!redhawkSocket)
          redhawkSocket.close();
        redhawkSocket = null;
      }


      ///////////////// INTERNAL ///////////////
      var _domains = {};        // A map of Domain factories launched by getDomain
      var redhawkSocket = null; // Handle for the service socket.

      var on_connect = function() {
        console.debug('Connected to REDHAWK Domain Monitoring Socket')
      }

      var on_msg = function(msg) {
        // msg is { domains: [], added: [], removed: [] }
        angular.copy(msg.domains, redhawk.domainIds);
      }

  }])
 ;
