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
  The REDHAWK REST Config provider encapsulates all of the URL transforms
  that represent the rest-python -exposed API (i.e., its URL Handlers).
 */
angular.module('redhawk.rest')
  .provider('Config', [function(){
    var getWSBasePath = function() {
      var loc = window.location, new_uri;
      if (loc.protocol === "https:") {
        new_uri = "wss:";
      } else {
        new_uri = "ws:";
      }
      new_uri += "//" + loc.host;

      return new_uri;
    };

    this.restPath = '/redhawk/rest';
    this.wsPath = '/redhawk/rest';
    this.websocketUrl = getWSBasePath() + this.wsPath;
    this.restUrl = this.restPath;

    this.redhawkSocketUrl = this.websocketUrl + '/redhawk';
    this.eventSocketUrl = this.websocketUrl + '/events';

    // General locations
    this.portsUrl = '/ports';
    this.portUrl = this.portsUrl + '/:portId';

    // Full URL helper paths matching the handlers back at the server.
    this.domainsUrl = this.restUrl + '/domains';
    this.domainUrl = this.domainsUrl + '/:domainId';
    this.deviceManagerUrl = this.domainUrl + '/deviceManagers/:managerId';
    this.deviceUrl = this.deviceManagerUrl + '/devices/:deviceId';
    this.devicePortsUrl = this.deviceUrl + this.portsUrl;
    this.devicePortUrl = this.deviceUrl + this.portUrl;
    this.waveformsUrl = this.domainUrl + '/applications';
    this.waveformUrl = this.waveformsUrl + '/:applicationId';
    this.waveformPortsUrl = this.waveformUrl + this.portsUrl;
    this.waveformPortUrl = this.waveformUrl + this.portUrl;
    this.componentsUrl = this.waveformUrl + '/components';
    this.componentUrl = this.componentsUrl + '/:componentId';
    this.componentPortsUrl = this.componentUrl + this.portsUrl;
    this.componentPortUrl = this.componentUrl + this.portUrl;

    var provider = this;
    this.$get = function() {
      return {
        restPath:         provider.restPath,
        websocketPath:    provider.wsPath,
        websocketUrl:     provider.websocketUrl,
        redhawkSocketUrl: provider.redhawkSocketUrl,
        eventSocketUrl:   provider.eventSocketUrl,
        restUrl:          provider.restUrl,
        domainsUrl:       provider.domainsUrl,
        domainUrl:        provider.domainUrl,
        deviceManagerUrl: provider.deviceManagerUrl,
        deviceUrl:        provider.deviceUrl,
        devicePortUrl:    provider.devicePortUrl,
        waveformsUrl:     provider.waveformsUrl,
        waveformUrl:      provider.waveformUrl,
        waveformPortUrl:  provider.waveformPortUrl,
        componentUrl:     provider.componentUrl,
        componentPortUrl: provider.componentPortUrl,
      };
    };
  }])
  
  /* 
   * Service for changing a parameterized Config url with 
   * appropriate parameters.  For example //domains/:domainId
   * becomes //domains/REDHAWK_DEV, etc.
   *
   * Adapted from: http://www.bennadel.com/blog/2613-using-url-interpolation-with-http-in-angularjs.htm
   */
  .service('InterpolateUrl', function() {
    return function (configUrl, params) {
      params = (params || {});

      configUrl = configUrl.replace( /(\(\s*|\s*\)|\s*\|\s*)/g, "" );

      // Replace each label in the URL (ex, :domainId).
      configUrl = configUrl.replace(
        /:([a-z]\w*)/gi,
        function( $0, label ) {
          return( popFirstKey( params, label ) || "" );
        }
      );

      // Strip out any repeating slashes (but NOT the http:// version).
      configUrl = configUrl.replace( /(^|[^:])[\/]{2,}/g, "$1/" );

      // Strip out any trailing slash.
      configUrl = configUrl.replace( /\/+$/i, "" );

      // Take 1...N objects and key and perform popKey on the first object
      // that has the given key. All others with the same key are ignored.
      function popFirstKey( object1, objectN, key ) {
        // Convert the arguments list into a true array so we can easily
        // pluck values from either end.
        var objects = Array.prototype.slice.call( arguments );

        // The key will always be the last item in the argument collection.
        var key = objects.pop();

        var object = null;

        // Iterate over the arguments, looking for the first object that
        // contains a reference to the given key.
        while ( object = objects.shift() ) {
          if ( object.hasOwnProperty( key ) ) {
            return( popKey( object, key ) );
          }
        }
      }
    
      // Delete the key from the given object and return the value.
      function popKey( object, key ) {
        var value = object[ key ];
        delete( object[ key ] );
        return( value );
      }

      return( configUrl );
    };
  })
;
