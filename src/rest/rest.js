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
  The REST service provides all of the basic HTTP request functionality
  distilled into methods that are used by the REDHAWK service and its various
  factories (Domain, Device, etc.).
*/
angular.module('redhawk.rest')
  .service('REST', ['$resource', 'Config', 
    function($resource, Config) {
      this.domain = $resource(Config.domainsUrl, {}, {
        query:        {method: 'GET', cache:false},
        info:         {method: 'GET', url: Config.domainUrl, cache:false},
      });

      /* Retaining for future upcoming feature 
      this.fileSystem = $resource(Config.domainUrl + '/fs/:path', {}, {
        query:        {method: 'GET', cache:false}
      }); */

      this.deviceManager = $resource(Config.deviceManagerUrl, {}, {
        query:        {method: 'GET', cache:false}
      });

      this.device = $resource(Config.deviceUrl, {}, {
        query:        {method: 'GET', cache:false},
        save:         {method: 'PUT', url: Config.deviceUrl + '/properties'},
      });

      this.feiDevice = $resource(Config.devicePortUrl, {}, {
        query:        {method: 'GET', cache:false },
      });

      this.feiTunerDevice = $resource(Config.devicePortUrl + '/:allocationId', {}, {
        query:        {method: 'GET', cache:false },
        tune:         {method: 'PUT' }
      });

      this.waveform = $resource(Config.waveformsUrl, {}, {
        query:        {method: 'GET',    url: Config.waveformUrl, cache:false},
        status:       {method: 'GET',    url: Config.waveformsUrl, cache:false},
        launch:       {method: 'POST',   url: Config.waveformsUrl},
        release:      {method: 'DELETE', url: Config.waveformUrl},
        update:       {method: 'POST',   url: Config.waveformUrl},
        configure:    {method: 'PUT',    url: Config.waveformUrl + '/properties'}
      });

      this.component = $resource(Config.componentUrl, {}, {
        query:        {method: 'GET', cache:false},
        configure:    {method: 'PUT', url: Config.componentUrl + '/properties'}
      });
  }])
;
