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

/**
 * Top-level module definition for redhawk.directives.  Encapsulates all directives,
 * views, and view controllers as well some filters (here, below).
 */
angular.module('redhawk.directives', ['redhawk.sockets', 'ngRoute'])
  /*
   * Splits the given ID by the "::" syntax that is common and yields the last
   * name of the resulting list.
   */
  .filter('cleanPropId', function() {
    return function (id) {
      var fields = id.split('::');
      return fields[fields.length-1];
    };
  })
;