import { Injectable, Optional } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Possible parent services
import { WaveformService } from '../waveform/waveform.service';
import { DeviceService } from '../device/device.service';
import { ComponentService } from '../component/component.service';

// And base service
import { BaseService } from '../shared/base.service';

// URL Builder
import { RestPythonService } from '../shared/rest.python.service';

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
} from './refs/refs.module';

// Enumerations
import {
    PortBulkIOType,
    PortFEIType,
    PortIDLNameSpace,
    PortDirection
} from './enums/enums.module';

// This model
import { Port } from './port';

@Injectable()
export class PortService extends BaseService<Port> {

    // Reference to the parent service
    protected parent: WaveformService | DeviceService | ComponentService;

    private _ref: PortRef;
    private _previousUniqueID: string;

    /**
     * The port's sub-reference interfaces.  For BulkIO, this will be a
     * BulkioRef giving connectPort and disconnectPort.  For FEI, these will
     * be interfaces that look like those defined in the associated IDL.
     */
    getRef(): PortRef { return this._ref; }

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
            }
            else {
                this.parent = _wave;
            }
        } else if (_device) {
            this.parent = _device;
        } else {
            console.error('Failed to provide a port bearing service');
        }
    }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.portUrl(this.parent.getBaseUrl(), this.getUniqueId());
    }

    uniqueQuery$(): Observable<Port> {
        return <Observable<Port>> this.parent.ports$(this.getUniqueId());
    }

    modelUpdated(model: Port) {
        if (this._previousUniqueID !== this.getUniqueId()) {
            if (model.direction === PortDirection.Uses &&
                model.idl.namespace === PortIDLNameSpace.BULKIO &&
                model.idl.type !== PortBulkIOType.UNKNOWN) {
                this._ref = new BulkioRef(this.getBaseUrl(), this.restPython);
            } else if (model.direction === PortDirection.Provides &&
                       model.idl.namespace === PortIDLNameSpace.FRONTEND) {
                switch (model.idl.type) {
                    case PortFEIType.AnalogTuner:
                        this._ref = new FeiAnalogTunerRef(this.getBaseUrl());
                        break;
                    case PortFEIType.DigitalTuner:
                        this._ref = new FeiDigitalTunerRef(this.getBaseUrl());
                        break;
                    case PortFEIType.GPS:
                        this._ref = new FeiGPSRef(this.getBaseUrl());
                        break;
                    case PortFEIType.NavData:
                        this._ref = new FeiNavDataRef(this.getBaseUrl());
                        break;
                    case PortFEIType.RFInfo:
                        this._ref = new FeiRFInfoRef(this.getBaseUrl());
                        break;
                    case PortFEIType.RFSource:
                        this._ref = new FeiRFSourceRef(this.getBaseUrl());
                        break;
                    default:
                        break;
                }
            }
            if (!this._ref) {
                this._ref = new PortRef(this.getBaseUrl());
            }
            this._previousUniqueID = this.getUniqueId();
        }
        super.modelUpdated(model);
    }
}
