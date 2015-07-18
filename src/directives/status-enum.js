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
  * The status enum attribute can be applied to buttons or labels.
  * to simplify putting color-coded enumerations (and text) onto your UI
  * in with a reusable directive.  
  * 
  * @param status - string "value" to select from the enumeration
  * @param enumeration - Map of string-values to Bootstrap CSS class and display
  *                 text.  The cssClass will either result in btn-<name> or 
  *                 label-<name> depending on the other classes in the DOM element.
  *                 An example enumeration map is:
  *           { 
  *             '-1' : { cssClass: 'danger',  text: 'Red' },
  *             '0'  : { cssClass: 'warning', text: 'Yellow-ish orange' },
  *             '1'  : { cssClass: 'success', text: 'Green' },
  *             '2'  : { cssClass: 'info',    text: 'Blue' },
  *           }
  *
  * Usage: <label status-enum class="label-sm" status="mystatus" enumeration="statusenum"></label>
  *
  * The resulting label will track mystatus and appropriately change the element class and insert
  * text to match.
  */
angular.module('redhawk.directives')
  .directive('statusEnum', function () {
    return {
        restrict: 'A',
        scope: { 
          status: "=",
          enumeration: "="
        },
        replace: false,
        link: function(scope, elem, attrs) {
          scope.$watch('status', function(status) {
            scope.nextClass = (elem.hasClass('btn')) ? 'btn-' : 'label-';
            scope.nextClass += scope.enumeration[status].cssClass;

            if (scope.lastClass)
              elem.removeClass(scope.lastClass);
            elem.addClass(scope.nextClass);
            scope.lastClass = scope.nextClass;

            elem.html(scope.enumeration[status].text);
          });
        }
      };
  })
;
