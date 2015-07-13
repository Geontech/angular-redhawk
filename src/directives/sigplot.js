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
   * settings as the SRI and buffers change.  What's different?  This 
   * controller assumes that the directive's scope has a `url` field pointing
   * to a `/bulkio` websocket interface, and opens its own socket to that port.
   * It will then manage that socket for as long as the controller is in view
   * and close it when necessary.
   */
  .controller('SigPlotController', ['$scope', 'Subscription',
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


      $scope.$watch('url', function(url) {
        if (!!url) {
          portSocket.close();
          portSocket.connect(url, on_connect);
        }
      });

      $scope.$watch('sri', function(sri) {
        if (!!sri) {
          reloadSettings = true;
          $scope.dataSettings.xstart = sri.xstart;
          $scope.dataSettings.xdelta = sri.xdelta;
          $scope.dataSettings.subsize = sri.subsize;
          $scope.dataSettings.format = getFormatStr($scope.dataType, sri.mode)
        }
      });

      $scope.$watchCollection('buffer', function(data) {
        if (!!data) {
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
      });
    }])
  /**
   * This is a PSD plot PSD directive.  Provide the socket URL to the bulkio port.
   * This can be obtained by finding a port with `canPlot == true`.  
   * Use the port's `bulkioUrl` as shown below:
   *
   * <div sig-plot-psd url="port.bulkioUrl"></div>
   */
  .directive('sigPlotPsd', 
    function() { 
      return { 
        restrict: 'A',
        scope: {
          url:          '=', // A Port's bulkioUrl
          dataType:     '=', // 'float', 'octet', etc.
          controlFn:    '&', // Callback function to parent (TBD)
          overrideID:   '@', // Override the DOM element ID the plot will use.
          plotSettings: '@', // Plot Settings
          fillStyle:    '@', // Filling settings
        },
        controller: 'SigPlotController',
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
          element.attr('id', sigPlotID);

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
            document.getElementById(sigPlotID), 
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

// OBE: This is the controller from admin-console, kept as a reference.
//   .controller('SigPlot', ['$scope', '$routeParams', 'RedhawkSocket', 'user',
//     function($scope, $routeParams, RedhawkSocket, user) {

//       $scope.waveformId = $routeParams.waveformId;
//       $scope.componentId = $routeParams.componentId;
//       $scope.name = $routeParams.portName;

//       var dataType = $routeParams.dataType ? $routeParams.dataType : 'float';

//       var defaultSettings = {
//         xdelta:10.25390625,
//         xstart: -1,
//         xunits: 3,
//         ydelta : 0.09752380952380953,
//         ystart: 0,
//         yunits: 1,
//         subsize: 8192,
//         size: 32768,
//         format: 'SF'
//       };
//       $scope.plotSettings = angular.copy(defaultSettings);

//       $scope.useSRISettings = true;
//       $scope.customSettings = angular.copy(defaultSettings);

//       $scope.$watch('useSRISettings', function(value) {
//         if(plot && raster && value) {
//           $scope.customSettings = angular.copy($scope.plotSettings);
//           reloadSri = true;
//         }
//       });

//       var plot, raster, layer, layer2;

//       var fillStyle = [
//         "rgba(255, 255, 100, 0.7)",
//         "rgba(255, 0, 0, 0.7)",
//         "rgba(0, 255, 0, 0.7)",
//         "rgba(0, 0, 255, 0.7)"
//       ];

//       var createPlot = function(format, settings) {

//         plot = new sigplot.Plot(document.getElementById("plot"), {
//           all: true,
//           expand: true,
//           autohide_panbars: true,
//           autox: 3,
//           legend: false,
//           xcnt: 0,
//           colors: {bg: "#222", fg: "#888"},
//           cmode: "D2"
//         });
//         plot.change_settings({
//           fillStyle: fillStyle
//         });

//         layer = plot.overlay_array(null, angular.extend(settings, {'format': format}));
//       };

//       var createRaster = function(format, settings) {
//         raster = new sigplot.Plot(document.getElementById("raster"), {
//           all: true,
//           expand: true,
//           autol: 100,
//           autox: 3,
//           autohide_panbars: true,
//           xcnt: 0,
//           colors: {bg: "#222", fg: "#888"},
//           cmode: "D2",
//           nogrid: true
//         });
//         raster.change_settings({
//           fillStyle: fillStyle
//         });
//         layer2 = raster.overlay_pipe(angular.extend(settings, {type: 2000, 'format': format, pipe: true, pipesize: 1024 * 1024 * 5}));
//       };

//       var reloadSri, useCustomSettings;

//       $scope.updateCustomSettings = function() {
//         if(!$scope.useSRISettings) {
//           useCustomSettings = true;
//           reloadSri = true;
//         } else {
//           useCustomSettings = false;
//         }
//       };

//       var getDataConverter = (function(){
//         /*
//          Create a map to convert the standard REDHAWK BulkIO Formats
//          into Javascript equivalents.
//          ----
//          byte      = 8-bit signed
//          char      = 8-bit unsigned
//          octet     = 8-bit The signed-ness is undefined
//          short     = 16-bit signed integer
//          ushort    = 16-bit unsigned integer
//          long      = 32-bit signed integer
//          ulong     = 32-bit unsigned integer
//          longlong  = 64-bit signed integer
//          ulonglong = 64-bit unsigned integer
//          float     = 32-bit floating point
//          double    = 64-bit floating point
//          ----
//          */
//         var conversionMap = {
//           byte: Int8Array,
//           char: Uint8Array,
//           octet: Uint8Array,
//           ushort: Uint16Array,
//           short: Int16Array,
//           long: Int32Array,
//           ulong: Uint32Array,
//           longlong: undefined, //This should be 64-bit
//           ulonglong: undefined, //This should be 64-bit
//           float: Float32Array,
//           double: Float64Array
//         };
//         var defaultConversion = Float32Array;

//         return function(type) {
//           var fn = conversionMap[type];
//           console.log("Requesting dataconverter for type '"+type+"'."+fn);

//           if(type == 'octet')
//             console.log("Plot::DataConverter::WARNING - Data type is 'octet' assuming unsigned.");

//           if(!fn) {
//             console.log("Plot::DataConverter::WARNING - Data type is '"+type+"' using default.");
//             fn = defaultConversion;
//           }

//           return function(data) { return new fn(data); };
//         };
//       })();
//       var dataConverter = getDataConverter(dataType);

//       var lastDataSize = 1000;

//       var on_data = function(data) {
//         var bpa;
//         switch (dataType) {
//           case 'double':
//             bpa = 8;
//             break;
//           case 'float':
//             bpa = 4;
//             break;
//           case 'octet':
//           case 'short':
//             bpa = 1;
//             break;
//           default:
//             return;
//         }

//         var ape;
//         switch (mode) {
//           case 'S':
//             ape = 1;
//             break;
//           case 'C':
//             ape = 2;
//             break;
//           default:
//             return;
//         }

//         //USE THIS CODE WHEN back-end is fixed
//         //assume single frame per handler invocation
// //        var array = dataConverter(data);
// //        lastDataSize = array.length;
// //        if (plot && raster) {
// //          reloadPlots(array);
// //        }

//         //WORKAROUND: take only number of bytes to make one frame
//         //back-end will be modified to send only one frame
//         var frameSize = $scope.plotSettings.subsize * bpa * ape;
//         //console.log(frameSize + ' bytes extracted');
//         data = data.slice(0, frameSize);
//         var array = dataConverter(data);//NB the return value toggles between two different length values. Thus the data is sometimes not properly formatted
//         lastDataSize = array.length;
//         //console.log(array.length + ' ' + dataType + ' elements plotted');
//         if (plot && raster) {
//           //WORKAROUND: This check should not be necessary. Every other frame seems to have invalid format
//           // apparently containing values that are not of the type specified in dataType
//           if (array.length !== frameSize / bpa) {
//             return;
//           }
//           reloadPlots(array);
//         }
//       };

//       var reloadPlots = function(data) {
//         if (reloadSri ) {
//           if (useCustomSettings) {
//             $scope.plotSettings = $scope.customSettings;
//           }
//           plot.reload(layer, data, $scope.plotSettings);
//           plot.refresh();
//           plot._Gx.ylab = 27; //this is a hack, but sigplot seems to be ignoring the settings value
//           raster.push(layer, data, $scope.plotSettings);
//           raster.refresh();
//           raster._Gx.ylab = 27; //this is a hack, but sigplot seems to be ignoring the settings value
//           reloadSri = false;
//         } else {
//           plot.reload(layer, data);
//           plot._Gx.ylab = 27; //this is a hack, but sigplot seems to be ignoring the settings value
//           raster.push(layer, data);
//           raster._Gx.ylab = 27; //this is a hack, but sigplot seems to be ignoring the settings value
//         }
//       };

//       var mode = undefined;

//       var updatePlotSettings = function(data) {
//         var isDirty = false;
//         angular.forEach(data, function(item, key){
//           if (angular.isDefined($scope.plotSettings[key]) && !angular.equals($scope.plotSettings[key], item) && item != 0) {
//             isDirty = true;
//             console.log("Plot settings change "+key+": "+$scope.plotSettings[key]+" -> "+item);
//             $scope.plotSettings[key] = item;
//           }
//         });

// //        $scope.plotSettings['size'] = lastDataSize * $scope.plotSettings['xdelta'];
// //        if(data['subsize'] == 0) {
// //          $scope.plotSettings['subsize'] = lastDataSize;
// //        }

//         if (!plot || !raster) {
//           var format = undefined;
//           switch (data.mode) {
//             case 0:
//               mode = "S";
//               break;
//             case 1:
//               mode = "C";
//               break;
//             default:
//           }

//           if (mode) {
//             switch (dataType) {
//               case "float":
//                 createPlot(mode + "F", $scope.plotSettings);
//                 createRaster(mode + "F", $scope.plotSettings);
//                 raster.mimic(plot, {xzoom: true, unzoom: true});
//                 console.log("Create plots with format " + mode + "F");
//                 break;
//               case "double":
//                 createPlot(mode + "D", $scope.plotSettings);
//                 createRaster(mode + "D", $scope.plotSettings);
//                 raster.mimic(plot, {xzoom: true, unzoom: true});
//                 console.log("Create plots with format " + mode + "D");
//                 break;
//               case "short":
//               case "octet":
//                 createPlot(mode + "B", $scope.plotSettings);
//                 createRaster(mode + "B", $scope.plotSettings);
//                 raster.mimic(plot, {xzoom: true, unzoom: true});
//                 console.log("Create plots with format " + mode + "D");
//                 break;
//               default:
//             }
//             isDirty = true;
//           }
//         }

//         if(isDirty && $scope.useSRISettings) {
//           reloadSri = true;
//           $scope.customSettings = angular.copy($scope.plotSettings);
//         }
//       };

//       var sriData = {};
// //      var keysFound=[];
//       var on_sri = function(sri) {
//         if (typeof sri === 'string') {
//           return;
//         }
//         updatePlotSettings(sri);
//         angular.forEach(sri, function(value, key){
// //          var found = keysFound.some(function(k) {
// //            return k == key;
// //          });
// //          if (!found) {
// //            console.log("SRI: " + key + " = " + JSON.stringify(value));
// //            keysFound.push(key);
// //          }
//           if(angular.isArray(value)) {
//             sriData[key] = value.join(", "); }
//           else if (angular.isObject(value) && typeof value !== 'string') {
//             var str = [];
//             angular.forEach(value, function(value, key) {
//               str.push(key+": "+value);
//             });
//             sriData[key] = '{' + str.join(', ') + '}';
//           } else {
//             sriData[ key ] =  value;
//           }
//         });

//         $scope.sri = sriData;
//       };

//       $scope.port = RedhawkSocket.port(
//           {domain: user.domain, waveform: $scope.waveformId, component: $scope.componentId, port: $scope.name},
//           on_data,
//           on_sri
//       );

//       $scope.$on("$destroy", function(){
//         $scope.port.close();
//       })
//     }