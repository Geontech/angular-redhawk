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
 
// Generic BULKIO ProtoBuf decoder.  
// get() Returns BULKIO plus dataBuffer matching type or null (if no match)
// controlWidth() Returns Control message
angular.module('redhawk.sockets')
  .service('BulkioPB2', [
    function () {
      var Decoder = dcodeIO.ProtoBuf.loadProtoFile("/protobuf/bulkio.proto").build();

      // Converts raw binary to BULKIO packet
      this.get = function(raw) {
        var pkt = Decoder.BULKIO.decode(raw);

        var type = null;
        switch (pkt.type) {
          case Decoder.BULKIO.TYPE.Char      : 
            type = '.DataChar.bulkio';
            break;
          case Decoder.BULKIO.TYPE.Short     : 
            type = '.DataShort.bulkio';
            break;
          case Decoder.BULKIO.TYPE.Long      : 
            type = '.DataLong.bulkio';
            break;
          case Decoder.BULKIO.TYPE.LongLong  : 
            type = '.DataLongLong.bulkio';
            break;
          case Decoder.BULKIO.TYPE.ULong     : 
            type = '.DataULong.bulkio';
            break;
          case Decoder.BULKIO.TYPE.ULongLong : 
            type = '.DataULongLong.bulkio';
            break;
          case Decoder.BULKIO.TYPE.Float     : 
            type = '.DataFloat.bulkio';
            break;
          case Decoder.BULKIO.TYPE.Double    : 
            type = '.DataDouble.bulkio';
            break;
          default:
            break;
        }

        angular.extend(pkt, { dataBuffer : (type ? pkt[type].dataBuffer : null) });
        return pkt;
      }

      this.dataTypes = Decoder.BULKIO.TYPE;
      this.sriModes = Decoder.SRI.MODE;

      // Creates a Control message for MaxWidth
      this.controlWidth = function(width) {
        var c = new Decoder.Control();
        c.type = Decoder.Control.TYPE.MaxWidth;
        c.value = width;
        return c;
      }
    }])
;