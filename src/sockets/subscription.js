/*
 * This file is protected by Copyright. Please refer to the COPYRIGHT file
 * distributed with this source distribution.
 *
 * This file is part of REDHAWK admin-console.
 *
 * REDHAWK admin-console is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * REDHAWK admin-console is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 */

/**
 * Convenience class to add a listener pattern to the standard WebSocket
 *
 */
angular.module('redhawk.sockets')
  .factory('Subscription', ['$rootScope', 
    function ($rootScope) {
      var Subscription = function() {
        var self = this;
        //////// PUBLIC INTERFACES  (immutable) ////////
        self.connect = connect;
        self.send = send;
        self.close = close;

        // Listener management
        self.addJSONListener = addJSONListener;
        self.addBinaryListener = addBinaryListener;
        self.removeJSONListener = removeJSONListener;
        self.removeBinaryListener = removeBinaryListener;

        //////// DEFINITIONS BELOW //////////

        /*
         * Connect to the websocket at the given path URL.
         * Callback will be called if connected.
         */
        function connect (path_, callback) {
          path = path_;
          ws = new WebSocket(path);

          ws.onopen = function (data) {
            console.debug("Socket opened: " + path);
            ws.binaryType = "arraybuffer";
            callback.call(ws, data);

            // If the outbound queue has been filling, send all now.
            var l = delayOutQueue.length;
            while (l--) {
              self.send(delayOutQueue(l));
              delayOutQueue.splice(l, 1);
            }
          };

          // Process each message.  Binary is a pass-through,
          // JSON data is parsed first into objects, then passed.
          ws.onmessage = function (e) {
            if (e.data instanceof ArrayBuffer) {
              relay.call(self, callbacks.binary, e.data);
            } 
            else {
              var reg = /:\s?(Infinity|-Infinity|NaN)\s?\,/g;
              var myData = e.data.replace(reg, ": \"$1\", ");
              relay.call(self, callbacks.json, JSON.parse(myData));
            }
          };
        }

        /* 
         * Add this callback to the JSON listeners
         * Messages received will be JSON structures converted to JS entities.
         */
        function addJSONListener  (callback) { callbacks.json.push(callback); }

        /*
         * Add a callback to the Binary listeners
         * Messages received will be binary character strings
         * (Good for protobufs, BULKIO, etc.)
         */
        function addBinaryListener  (callback) { callbacks.binary.push(callback); }

        /* 
         * Remove callback from JSON Listeners
         */
        function removeJSONListener (callback) { remove(callback, callbacks.json); }

        /*
         * Remove callback from Binary Listeners
         */
        function removeBinaryListener (callback) { remove(callback, callbacks.binary); }

        /*
         * Send data on the websocket
         */
        function send  (data) {
          if (undefined == ws) 
            delayOutQueue.push(data);
          else 
            ws.send(data);
        }

        /*
         * Close the websocket.  Generally, it's a good idea to 
         * close the connection when it is no longer necessary,
         * i.e., a Controller is being destroyed in the UI that 
         * created an instance of this factory.
         */
        function close () {
          if (ws) ws.close();
          console.log("Socket closed: " + path);
        }



        //////// INTERNAL ////////


        // path - the URL to which this socket is connected.
        var path = undefined;
        var ws = undefined;
        var callbacks = {
          message: [],
          json: [],
          binary: []
        };
        var delayOutQueue = [];

        // Simple remove-from-list function.
        var remove = function(callback, callbacks) {
          var i = callbacks.indexOf(callback);
          if (-1 < i)
            callbacks.splice(i, 1);
        }

        // Moves each listener callback up to the right scope before calling it.
        var relay = function (callbacks, data) {
          var scope = this;
          angular.forEach(callbacks, function (callback) {
            $rootScope.$apply(function () {
              callback.call(scope, data);
            });
          });
        }
      }

      return Subscription;
    }])
;