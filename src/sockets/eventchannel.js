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
 * Use addChannel and removeChannel to attach to channel names (e.g., 'IDM_Channel').
 * 
 * Requires a Domain ID to filter incoming messages.
 */
angular.module('redhawk.sockets')
  .factory('EventChannel', ['SubscriptionSocket',
    function(SubscriptionSocket) {
      return function(domainID, parent_on_msg, parent_on_connect) {
        var self = this;

        // Public interfaces
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
        var addChannel = function(channel) {
          if (-1 == self.channels.indexOf(channel)) {
            eventMessageSocket.send(Msg('ADD', topic));
            self.channels.push(channel);
          }
        }

        /*
         * Disconnect from a named channel.
         * For example, addChannel('ODM_Channel')
         */
        var removeChannel = function(channel) {
          var chanIdx = self.channels.indexOf(channel)
          if (-1 < chanIdx) {
            eventMessageSocket.send(Msg('REMOVE', topic));
            self.channels.splice(chanIdx, 1);
          }
        }

        /* 
         * Retrieve a copy of the message buffer
         */
        var getMessages = function() {
          return angular.copy(messages);
        }

        /* 
         * Retrieve a copy of the event channels known to this instance.
         */
        var getChannelNames = function() {
          return angular.copy(channels);
        }

        /*
         * Add an additional listener callback to this EventChannel's various subscriptions.
         */
        var addListener = function(callback) {
          eventMessageSocket.addJSONListener(callback);
        }

        /*
         * Stop listening to this EventChannels' subscriptions.
         */
        var removeListener = function(callback) {
          eventMessageSocket.removeListener(callback);
        }

        ///////////// INTERNAL ////////////

        var messages = [];
        var channels = [];

        var on_connect = function() {
          if (parent_on_connect)
            parent_on_connect(self);
        }

        var on_msg = function(obj){
          messages.push(obj);

          if(messages.length > 500)
            angular.copy(messages.slice(-500), messages);

          if (parent_on_msg)
            parent_on_msg.call(self, obj);
        }

        var Msg = function(command, topic, domainId) {
          return JSON.stringify({command: command, topic: topic, domainId: domainId});
        }

        // Create the subscription socket, connect to the appropriate URL, and wait for connection.
        // Bind a JSON listener to forward incoming events to the local handler.
        var eventMessageSocket = new SubscriptionSocket();
        eventMessageSocket.connect(Config.eventSocketUrl, function() { on_connect.call(self); });
        eventMessageSocket.addJSONListener(function(json) { on_msg.call(self, json); });
        eventMessageSocket.addBinaryListener(function(data){ console.warn("WARNING Event Channel Binary Data!"); });
      };
  }])
;