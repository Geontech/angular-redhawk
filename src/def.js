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
angular.module('redhawk', ['redhawk.rest', 'redhawk.util', 'redhawk.sockets', 'redhawk.directives'])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.transformResponse.unshift(function(response, headersGetter) {
      var ctype = headersGetter('content-type');
      if(ctype && ctype.indexOf('json') > -1) {
        var reg = /:\s?(Infinity|-Infinity|NaN)\s?\,/g;
        return response.replace(reg, ": \"$1\", ");
      } else {
        return response;
      }
    });
  }])
;
