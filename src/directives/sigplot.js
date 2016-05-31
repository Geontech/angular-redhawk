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
  .controller('BulkioSocketController', 
    ['$scope', 'Subscription', 'BulkioPB2', 'SigPlotFillStyles',
    function ($scope, Subscription, BulkioPB2, SigPlotFillStyles) {
      // Get a new socket instance and listen for binary and JSON data.
      var portSocket = new Subscription();
      portSocket.addBinaryListener(on_data);
      var plotValid = false;

      /*
       * When the plot settings change, create a new sigplot
       */
      $scope.$watch('plotSettings', function(plotSettings) {
        plotValid = false;
        $scope.plotSettings = plotSettings;
        $scope.plot = new sigplot.Plot(
          $scope.element,
          $scope.plotSettings
        );
        $scope.plot.change_settings({
          fillStyle: $scope.fillStyle
        });
        $scope.signalLayers = {};
        plotValid = true;
      }, true);

      /* 
       * When the URL changes, attempt to connect to the socket.
       */
      $scope.$watch('port', function(port) {
        plotValid = false;
        portSocket.close();
        if (port && port.bulkioUrl && port.canPlot) {
          $scope.plot.deoverlay();
          $scope.signalLayers = {};
          portSocket.connect(port.bulkioUrl, function() { 
            console.log("Connected to BULKIO port @ " + port.bulkioUrl);
            plotValid = true;
          });
        }
      });

      /*
       * If the controller closes/is removed, be nice and shut down the socket
       */
      $scope.$on("$destroy", function() {
        portSocket.close();
      });

      /*
       * Process the incoming raw data into its structure and then plots it.
       * TODO: Add multi-layer support.  by having multiple plot layers and 
       *       refreshing them independently, one can have multiple signals 
       *       on the same plot.
       */
      function on_data (raw) {
        if (!plotValid) {
          return;
        }

        var dataPB2 = BulkioPB2.get(raw);

        // On EOS remove the layer
        if (dataPB2.EOS && $scope.signalLayers.hasOwnProperty(dataPB2.streamID)) {
          var plotLayer = $scope.signalLayers[dataPB2.streamID].plotLayer;
          $scope.plot.remove_layer(plotLayer);
          delete $scope.signalLayers[dataPB2.streamID];
          return;
        }

        var reloadSettings = false;

        // Format string specific to sigplot
        // per the enclosed data type
        var getFormatStr = function(bulkioObj) {
          var s = (bulkioObj.SRI.mode === BulkioPB2.sriModes.COMPLEX) ? 'C' : 'S';
          switch (bulkioObj.type) {
            case BulkioPB2.dataTypes.Float:
              s += 'F';
              break;
            case BulkioPB2.dataTypes.Double:
              s += 'D';
              break;
            case BulkioPB2.dataTypes.Short:
            case BulkioPB2.dataTypes.Char:
            case BulkioPB2.dataTypes.Octet:
            default: // TODO: Account for the various Long's
              s += 'B';
              break;
          }
          return s;
        }

        // Get or create a copy of data settings for this streamID
        var signalLayerData = null;
        if (dataPB2.streamID in $scope.signalLayers) {
          signalLayerData = $scope.signalLayers[dataPB2.streamID];
        }
        if (!signalLayerData) {
          reloadSettings = true;
          var dataSettings = angular.copy($scope.dataSettings);
          var plotLayer = $scope.plot.overlay_array(
            dataPB2.streamID, 
            null
          );
          var signalLayerData = {
            'dataSettings' : dataSettings,
            'plotLayer'    : plotLayer
          };
          $scope.signalLayers[dataPB2.streamID] = signalLayerData;

          // Override fillStyle if it contains fills and we are plotting
          // now more than one signal
          var numKeys = Object.keys($scope.signalLayers).length;

          if (1 < numKeys) {
            $scope.originalFillStyle = angular.copy($scope.fillStyle);
            $scope.fillStyle = SigPlotFillStyles.DefaultLine;
            $scope.plot.change_settings({
              fillStyle: $scope.fillStyle,
            });
          } else if (1 == numKeys) {
            $scope.fillStyle = $scope.originalFillStyle;
            $scope.plot.change_settings({
              fillStyle: $scope.fillStyle
            });
          }
        }
        
        if (!!dataPB2.sriChanged) {
          reloadSettings = true;
          signalLayerData.dataSettings.xstart  = dataPB2.SRI.xstart;
          signalLayerData.dataSettings.xdelta  = dataPB2.SRI.xdelta;
          signalLayerData.dataSettings.size    = dataPB2.SRI.subsize;
          signalLayerData.dataSettings.subsize = dataPB2.SRI.subsize;
          signalLayerData.dataSettings.format  = getFormatStr(dataPB2);
        }

        if (!!dataPB2.dataBuffer) {
          if (reloadSettings) {
            $scope.plot.reload(
              signalLayerData.plotLayer, 
              dataPB2.dataBuffer, 
              signalLayerData.dataSettings);
            $scope.plot.refresh();
          }
          else {
            $scope.plot.reload(
              signalLayerData.plotLayer, 
              dataPB2.dataBuffer);
          }

          // A hack noted that this field gets ignored repeatedly.
          // this fixes it.
          $scope.plot._Gx.ylab = signalLayerData.dataSettings.yunits;
        }
      }

      /* Detect width of the plotting container having changed.
       * If it changes, calculate the Log2 equivalent width and 
       * pass it back to the server.  The result will do decimate
       * using a neighbor-mean approach.
      */
      var currentPow = 0;
      $scope.maxSamples = $scope.maxSamples || 1024;
      $scope.$watch('maxSamples',
        function() {
          var newPow = Math.floor(Math.log($scope.maxSamples) / Math.log(2));
          if (currentPow != newPow) {
            currentPow = newPow;
            var widthLog2 = Math.pow(2, newPow);

            var controlPB2 = BulkioPB2.controlWidth(widthLog2);
            portSocket.send(controlPB2.toBuffer());
          }
        }
      );
    }])
  
  /*
   * Various fill styles for the sigPlotPsd.
   */
  .constant('SigPlotFillStyles', {
    'DefaultLine' : null, // Default line is no fill, because it's a line.
    'DefaultPSD'  : [
      // Color cascade through the spectrum
      "rgba(255, 255, 100, 0.7)",
      "rgba(255, 0, 0, 0.7)",
      "rgba(0, 255, 0, 0.7)",
      "rgba(0, 0, 255, 0.7)"
    ]
  })

  /**
   * This is a PSD plot PSD directive.  Provide the BULKIO port and
   * an explicit height (i.e., not a percent).
   *
   * This can be obtained by finding a port with `canPlot == true` 
   * and supplying it to the directive:
   * <sig-plot-psd port="device.port" height="400"></sig-plot-psd>
   */
  .directive('sigPlotPsd', ['SigPlotFillStyles',
    function(SigPlotFillStyles) { 
      return { 
        restrict: 'E',
        template: '<div style="height: inherit; width: inherit;"></div>',
        scope: {
          port:         '=', // A BULKIO Port
          overrideID:   '@', // Override the DOM element ID the plot will use.
          plotSettings: '=', // Plot Settings
          fillStyle:    '@', // Filling settings
          maxSamples:   '@', // Controls decimation factor.
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
            nopan             : true,
            xcnt              : 0,
            colors            : {bg: "#222", fg: "#888"},
            cmode             : "MA"
          }

          // Save a reference to the DOM element in case the sigplot is reset
          scope.element = element.children()[0];

          // Plot handle and fill settings.
          scope.plot = new sigplot.Plot(
            scope.element,
            scope.plotSettings);

          // Fill settings are CSS settings
          scope.fillStyle = scope.fillStyle || SigPlotFillStyles.DefaultPSD;
          scope.plot.change_settings({
            fillStyle: scope.fillStyle,
          });
          scope.originalFillStyle = scope.fillStyle;

          // The plot layer is what gets updated when the buffer is drawn.
          // Adding multiple layers will create a legend such that the file_name
          // is the signal name.
          scope.signalLayers = {};
        }
      }; 
    }]);

