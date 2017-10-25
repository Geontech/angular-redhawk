import { Injectable, Optional } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Model and Enumerations
import { Port, PortFEIIDLType } from '../models/index';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Possible parent services
import { WaveformService } from '../waveform/waveform.module';
import { DeviceService } from '../device/device.module';
import { ComponentService } from '../component/component.module';

// And base service
import { BaseService } from '../base/index';

// Common port "ref" and the specific ones.
import {
    PortRef,
    BulkioRef,
    FeiAnalogTunerRef,
    FeiDigitalTunerRef,
    FeiGPSRef,
    FeiNavDataRef,
    FeiRFInfoRef,
    FeiRFSourceRef
} from './refs/index';

/**
 * The Port Service provides unique interfaces to different types of ports 
 * through the 'ref' member.  That member is a sub-service which may
 * include REST callbacks for FEI ports vs. websocket controls for BULKIO.
 */
@Injectable()
export class PortService extends BaseService<Port> {

    // Reference to the parent service
    protected parent: WaveformService | DeviceService | ComponentService;

    private _ref: PortRef = null;
    private _previousUniqueId: string;

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        @Optional() private _wave: WaveformService,
        @Optional() private _device: DeviceService,
        @Optional() private _component: ComponentService
        ) {
        super(http, restPython);
        if (_wave) {
            if (_component) {
                this.parent = _component;
            } else {
                this.parent = _wave;
            }
        } else if (_device) {
            this.parent = _device;
        } else {
            console.error('Failed to provide a port bearing service');
        }
    }

    /**
     * The port's sub-reference interfaces.  For BulkIO, this will be a
     * BulkioRef giving connectPort and disconnectPort.  For FEI, these will
     * be interfaces that look like those defined in the associated IDL.
     *
     * Use model.hasBulkioWebsocket to determine if this is a BulkioRef.
     * Use model.isFEIControllable to determine if this is one of the FEI Refs.
     *
     * Then use model.idl.type to determine the sub-type (either the data type
     * of the BulkioRef, or the FeiXXXXRef ref type).
     */
    getRef(): PortRef { return this._ref; }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.portUrl(this.parent.baseUrl, this.uniqueId);
    }

    uniqueQuery$(): Observable<Port> {
        return <Observable<Port>> this.parent.ports$(this.uniqueId);
    }

    modelUpdated(model: Port) {
        if (this._previousUniqueId !== this.uniqueId) {
            if (this._ref) {
                this._ref.release();
                this._ref = null;
            }

            if (model.hasBulkioWebsocket) {
                this._ref = new BulkioRef(this.baseUrl, this.restPython);
            } else if (model.isFEIControllable) {
                switch (model.idl.type) {
                    case PortFEIIDLType.AnalogTuner:
                        this._ref = new FeiAnalogTunerRef(this.baseUrl);
                        break;
                    case PortFEIIDLType.DigitalTuner:
                        this._ref = new FeiDigitalTunerRef(this.baseUrl);
                        break;
                    case PortFEIIDLType.GPS:
                        this._ref = new FeiGPSRef(this.baseUrl);
                        break;
                    case PortFEIIDLType.NavData:
                        this._ref = new FeiNavDataRef(this.baseUrl);
                        break;
                    case PortFEIIDLType.RFInfo:
                        this._ref = new FeiRFInfoRef(this.baseUrl);
                        break;
                    case PortFEIIDLType.RFSource:
                        this._ref = new FeiRFSourceRef(this.baseUrl);
                        break;
                    default:
                        console.warn('Provides (controllable) FEI port has unknown Port Type');
                        break;
                }
            }

            // Still not set? Use default.
            if (!this._ref) {
                this._ref = new PortRef(this.baseUrl);
            }

            // Set previousUniqueId to this one.
            this._previousUniqueId = this.uniqueId;
        }
        super.modelUpdated(model);
    }
}
