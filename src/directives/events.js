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
 * A collection of directives related to viewing events from an event channel.
 */
angular.module('redhawk.directives')
  /*
   * Provides a list-view of messages and/or event structures in the order
   * found in events
   * 
   * @param events - Array of event/message structures
   * @param max - The maximum number of elements to show (>= 1)
   */
  .directive('eventView', function () {
    return {
      templateUrl: 'directives/tmpls/event-view.html',
      restrict: 'E',
      scope: {
        rhEvents   : '=',
        max        : '='
      },
      controller: function($scope) {
        // setup defaults.
        $scope.max = $scope.max || 5;

        /*
         * Determines the type of the event structure:
         *    0 = Unknown
         *    1 = ODM
         *    2 = IDM
         *    3 = Prop Event
         *    4 = Message
         */
        $scope.typeOfEvent = function (rhEvent) {
          var t = 0;

          if (rhEvent.hasOwnProperty('sourceCategory') && rhEvent.sourceName) {
            t = 1;
          }
          else if (rhEvent.hasOwnProperty('stateChangeCategory') && rhEvent.stateChangeCategory) {
            t = 2;
          }
          else if (rhEvent.hasOwnProperty('properties') && rhEvent.properties) {
            t = 3;
          }
          if (rhEvent.hasOwnProperty('id') && rhEvent.id) {
            t = 4;
          }
          return t;
        };
      }
    }
  })
  
  .directive('odmEvent', function () {
    return {
      templateUrl : 'directives/tmpls/odm-event.html',
      restrict    : 'E',
      scope       : { obj : '=rhEvent' }
    }
  })
  .directive('idmEvent', function () {
    return {
      templateUrl : 'directives/tmpls/idm-event.html',
      restrict    : 'E',
      scope       : { obj : '=rhEvent' }
    }
  })
  .directive('propEvent', function () {
    return {
      templateUrl : 'directives/tmpls/prop-event.html',
      restrict    : 'E',
      scope       : { obj : '=rhEvent' }
    }
  })
  .directive('messageEvent', function () {
    return {
      templateUrl : 'directives/tmpls/message-event.html',
      restrict    : 'E',
      scope       : { obj : '=rhEvent' }
    }
  })
;
