/*
 * This file is protected by Copyright. Please refer to the COPYRIGHT file
 * distributed with this source distribution.
 *
 * This file is part of REDHAWK admin-console.
 *
 * REDHAWK admin-console is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * REDHAWK admin-console is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 */
 angular.module('redhawk.directives')

  /**
   * Similar to admin-console's version, the controller manages updating
   * settings as the SRI and buffers change.  What's different?
   *  
   * This controller assumes the directive $scope was given a BULKIO port
   * which it can intuit using the bulkioUrl and plotType fields that are 
   * provided by RESTPortBearer base factory.
   *
   * The result is a controller that internally manages a socket connected
   * to the bulkio port.  If the DOM element and controller are removed
   * (destroyed) the socket closes automatically.
   */
  .controller('BulkioSocketController', ['$scope', 'Subscription',
    function ($scope, Subscription) {
      // Get a new socket instance and listen for binary and JSON data.
      var portSocket = new Subscription();
      portSocket.addBinaryListener(on_data);
      portSocket.addJSONListener(on_sri);

      var reloadSettings = true;

      var getFormatStr = function(dataType, sriMode) {
        var s = (sriMode === 0) ? 'S' : 'C';
        switch (dataType) {
          case 'float':
            s += 'F';
            break;
          case 'double':
            s += 'D';
          case 'short':
          case 'char':
          case 'octet':
          default:
            s += 'B';
            break;
        }
        return s;
      }

      /* 
       * When the URL changes, attempt to connect to the socket.
       */
      $scope.$watch('port', function(port) {
        portSocket.close();
        if (port && port.bulkioUrl && port.canPlot) {
          portSocket.connect(port.bulkioUrl, function() { 
            console.log("Connected to BULKIO port @ " + port.bulkioUrl); 
          });
        }
      });

      /*
       * Process the incoming data 
       */
      function on_data (data) {
        if ($scope.dataSettings.size != data.length){
          reloadSettings = true;
          $scope.dataSettings.size = data.length;
        }

        if (reloadSettings) {
          reloadSettings = false;
          $scope.plot.reload($scope.plotLayer, data, $scope.dataSettings);
          $scope.plot.refresh();
        }
        else {
          $scope.plot.reload($scope.plotLayer, data);
        }
        // A hack noted that this field gets ignored repeatedly.
        // this fixes it.
        $scope.plot._Gx.ylab = $scope.dataSettings.yunits;
      }

      /* 
       * Process SRI
       */
      function on_sri (sri) {
          reloadSettings = true;
          $scope.dataSettings.xstart = sri.xstart;
          $scope.dataSettings.xdelta = sri.xdelta;
          $scope.dataSettings.subsize = sri.subsize;
          $scope.dataSettings.format = getFormatStr($scope.port.plotType, sri.mode);
      }

      /*
       * If the controller closes/is removed, be nice and shut down the socket
       */
      $scope.$on("$destroy", function() {
        portSocket.close();
      });
    }])

  /**
   * This is a PSD plot PSD directive.  Provide the BULKIO port and
   * an explicit height (i.e., not a percent).
   *
   * This can be obtained by finding a port with `canPlot == true` 
   * and supplying it to the directive:
   * <sig-plot-psd port="device.port" height="400"></sig-plot-psd>
   */
  .directive('sigPlotPsd', 
    function() { 
      return { 
        restrict: 'E',
        template: '<div style="height: inherit; width: 100%;"></div>',
        scope: {
          port:         '=', // A BULKIO Port
          overrideID:   '@', // Override the DOM element ID the plot will use.
          plotSettings: '@', // Plot Settings
          fillStyle:    '@', // Filling settings
        },
        controller: 'BulkioSocketController',
        link: function(scope, element, attrs) {
          function randomID() {
              var text = "";
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

              for( var i=0; i < 5; i++ )
                  text += possible.charAt(Math.floor(Math.random() * possible.length));

              return 'sigPlot_' + text;
          }
          // Set the directive ID to overrideID or make something up.
          var sigPlotID = scope.overrideID || randomID();

          // See http://demo.axiosengineering.com/sigplot/doc/global.html#UNITS
          // regarding the `units` enumerations
          scope.dataSettings = {
            xdelta  :     1,
            xunits  :     3,  // Frequency (Hz)
            xstart  :     0,
            yunits  :    27,  // Magnitude, 20-log
            ystart  :     0,
            subsize :  2048,
            size    :  2048,
            format  :  'SF',  
          };

          // Derived from admin-console
          // NOTE: These settings are similar to xmidas, on which sigplot is based.
          scope.plotSettings = scope.plotSettings || {
            all               : true,
            expand            : true,
            autox             : 3,
            autoy             : 3,
            ydiv              : 10,
            xdiv              : 10,
            autohide_panbars  : true,
            xcnt              : 0,
            colors            : {bg: "#222", fg: "#888"},
            cmode             : "MA"
          }

          // Plot handle and fill settings.
          scope.plot = new sigplot.Plot(
            element.children()[0],
            //document.getElementById(sigPlotID), 
            scope.plotSettings);

          // Fill settings are CSS settings
          scope.fillStyle = scope.fillStyle || [
              "rgba(255, 255, 100, 0.7)",
              "rgba(255, 0, 0, 0.7)",
              "rgba(0, 255, 0, 0.7)",
              "rgba(0, 0, 255, 0.7)"
            ];
          scope.plot.change_settings({
            fillStyle: scope.fillStyle,
          });

          // The plot layer is what gets updated when the buffer is drawn.
          // Adding multiple layers will create a legend such that the file_name
          // is the signal name.
          scope.plotLayer = scope.plot.overlay_array(null,
            angular.extend(scope.dataSettings, {
              'file_name' : sigPlotID,  // Name in legend, if present
            })
          );
        }
      }; 
    })
;