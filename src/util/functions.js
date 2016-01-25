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


// Global utility functions
var UtilityFunctions = UtilityFunctions || {

  /* 
   * Returns items in oldList not found in newList
   */
  filterOldList : function(oldList, newList) {
    var out = [];
    var unique = true;
    for (var oldI = 0; oldI < oldList.length; oldI++) {
      for (var newI = 0; newI < newList.length; newI++) {
        if (oldList[oldI] == newList[newI]) {
          unique = false;
          break;
        }
      }
      if (unique) 
        out.push(oldList[oldI]);
      unique = true;
    }
    return out;
  },

  /* 
   * Loops through a list of properties and returns the one of matching id (or undefined)
   */
  findPropId : function (properties, propId) {
    for (var i = 0; i < properties.length; i++) {
      if (propId == properties[i].id)
        return properties[i];
    }
    return undefined;
  },
};