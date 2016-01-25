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
  The NotificationService can be used to post simple notifications into the active
  browser UI.  One such example is from the Domain factory launching waveforms.
  This service is relatively unmodified from its admin-console version.
 */
angular.module('redhawk.util')
  .service('NotificationService', ['toastr',
    function(toastr){
      var self = this;

      self.msg = function(severity, message, subject) {
        var title = subject || severity.toUpperCase();

        console.log("["+severity.toUpperCase()+"] :: "+message);
        switch (severity) {
          case 'error':
            toastr.error(message, title);
            break;
          case 'success':
            toastr.success(message, title);
            break;
          case 'info':
          default:
            toastr.info(message, title);
            break;
        }
      };

      self.error = function(text, subject) {
        self.msg("error", text, subject);
      };
      self.info = function(text, subject) {
        self.msg("info", text, subject);
      };
      self.success = function(text, subject) {
        self.msg("success", text, subject);
      };
    }
  ])
;
