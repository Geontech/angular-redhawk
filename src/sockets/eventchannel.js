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
 * Angular-REDHAWK Event Channel Listener.
 * 
 * Constructor requires domainID; the remaining elements are optional.  If you provide
 * a buffer, the EventChannel will maintain the list up to 500 in length automatically.
 * 
 * Use addChannel and removeChannel to attach to channel names (e.g., 'IDM_Channel').
 * 
 * Requires a Domain ID to filter incoming messages.
 */
angular.module('redhawk.sockets')
  .factory('EventChannel', ['Subscription', 'Config',
    function(Subscription, Config) {
      return function(domainID, buffer, parent_on_msg, parent_on_connect) {
        var self = this;

        // Public interfaces (immutable)
        self.addChannel = addChannel;
        self.removeChannel = removeChannel;
        self.getMessages = getMessages;
        self.getChannelNames = getChannelNames;
        self.addListener = addListener;
        self.removeListener = removeListener;

        ///// DEFINITIONS BELOW ///////

        /*
         * Connect to a named channel.
         * For example, addChannel('ODM_Channel')
         */
        function addChannel (channel) {
          if (-1 == channels.indexOf(channel)) {
            eventMessageSocket.send(Msg('ADD', channel));
            channels.push(channel);
            console.debug('Connected to ' + domainID + '-->' + channel);
          }
        }

        /*
         * Disconnect from a named channel.
         * For example, addChannel('ODM_Channel')
         */
        function removeChannel (channel) {
          var chanIdx = channels.indexOf(channel)
          if (-1 < chanIdx) {
            eventMessageSocket.send(Msg('REMOVE', channel));
            channels.splice(chanIdx, 1);
            console.debug('Disconnected from ' + domainID + '-->' + channel);
          }
        }

        /* 
         * Retrieve a copy of the message buffer
         */
        function getMessages () {
          return angular.copy(messages);
        }

        /* 
         * Retrieve a copy of the event channels known to this instance.
         */
        function getChannelNames () {
          return angular.copy(channels);
        }

        /*
         * Add an additional listener callback to this EventChannel's various subscriptions.
         */
        function addListener (callback) {
          eventMessageSocket.addJSONListener(callback);
        }

        /*
         * Stop listening to this EventChannels' subscriptions.
         */
        function removeListener (callback) {
          eventMessageSocket.removeListener(callback);
        }

        ///////////// INTERNAL ////////////

        // Use the provided buffer or a new list
        var messages = buffer || [];
        var channels = [];

        var on_connect = function() {
          if (parent_on_connect)
            parent_on_connect.call(self);
        }

        var on_msg = function(obj){
          messages.push(obj);

          if(messages.length > 500)
            angular.copy(messages.slice(-500), messages);

          if (parent_on_msg)
            parent_on_msg.call(self, obj);
        }

        var Msg = function(command, topic, domainId) {
          return JSON.stringify({command: command, topic: topic, domainId: domainID});
        }

        // Create the subscription socket, connect to the appropriate URL, and wait for connection.
        // Bind a JSON listener to forward incoming events to the local handler.
        var eventMessageSocket = new Subscription();
        eventMessageSocket.connect(Config.eventSocketUrl, function() { on_connect(); });
        eventMessageSocket.addJSONListener(   on_msg);
        eventMessageSocket.addBinaryListener( function(data) { console.warn("WARNING Event Channel Binary Data!"); });
      };
  }])
;