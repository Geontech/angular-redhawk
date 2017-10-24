import {
    Injectable,
    Optional,
    ReflectiveInjector
} from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service & base class
import { RedhawkService } from '../redhawk/redhawk.service';
import { BaseService }    from '../base/base.service';

// This model
import { Domain } from './domain';

// Child models
import {
    Waveform,
    WaveformSADRefs,
    IWaveformLaunchCommand,
    IWaveformLaunchCommandResponse,
    deserializeWaveformSADRefs
} from '../waveform/waveform';

import {
    DeviceManager,
    DeviceManagerRefs,
    deserializeDeviceManagerRefs
} from '../devicemanager/devicemanager';

import { Device } from '../device/device';

import {
    ResourceRefs,
    deserializeResourceRefs
} from '../base/resource';

import { PropertySet, PropertyCommand } from '../property/property';

import { OdmListenerService } from '../sockets/odm/odm.listener.service';

@Injectable()
export class DomainService extends BaseService<Domain> {
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected redhawkService: RedhawkService,
        @Optional() protected odmListener: OdmListenerService
        ) {
        super(http, restPython);

        if (!this.odmListener) {
            let injector = ReflectiveInjector.resolveAndCreate([OdmListenerService]);
            this.odmListener = injector.get(OdmListenerService);
        }

        // Bind update() to apps, factories, and device manager changes.
        this.odmListener.getApplicationAdded$().subscribe(o => this.update());
        this.odmListener.getApplicationRemoved$().subscribe(o => this.update());
        this.odmListener.getApplicationFactoryAdded$().subscribe(o => this.update());
        this.odmListener.getApplicationFactoryRemoved$().subscribe(o => this.update());
        this.odmListener.getDeviceManagerAdded$().subscribe(o => this.update());
        this.odmListener.getDeviceManagerRemoved$().subscribe(o => this.update());
    }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.domainUrl(this.redhawkService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Domain> {
        return this.redhawkService.attach$(this.uniqueId);
    }


    // Configure properties
    public configure(properties: PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .catch(this.handleError);
        this.delayedUpdate();
    }

    // Get a list of running apps or a specific instance
    public apps$(waveformId?: string): Observable<Waveform> | Observable<ResourceRefs> {
        if (waveformId) {
            return this.http
                .get(this.restPython.waveformUrl(this.baseUrl, waveformId))
                .map(response => new Waveform().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.waveformUrl(this.baseUrl))
                .map(response => deserializeResourceRefs(response.json().applications))
                .catch(this.handleError);
        }
    }

    // Get a list of launchable waveforms
    public catalogSads$(): Observable<WaveformSADRefs> {
        return this.http
            .get(this.restPython.waveformUrl(this.baseUrl))
            .map(response => deserializeWaveformSADRefs(response.json().waveforms))
            .catch(this.handleError);
    }

    // Launch a waveform
    public launch$(waveformName: string, started?: boolean): Observable<IWaveformLaunchCommandResponse> {
        let command: IWaveformLaunchCommand = { name: waveformName, started: started || false};
        return this.http
            .post(this.restPython.waveformUrl(this.baseUrl), command)
            .map(response => {
                this.delayedUpdate();
                return response.json() as IWaveformLaunchCommandResponse;
            })
            .catch(this.handleError);
    }

    // Get a list of device managers or a specific instance
    public devMgrs$(deviceManagerId?: string): Observable<DeviceManager> | Observable<DeviceManagerRefs> {
        if (deviceManagerId) {
            return this.http
                .get(this.restPython.deviceManagerUrl(this.baseUrl, deviceManagerId))
                .map(response => new DeviceManager().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.deviceManagerUrl(this.baseUrl))
                .map(response => deserializeDeviceManagerRefs(response.json().deviceManagers))
                .catch(this.handleError);
        }
    }

    // Get a list of devices or a specific instance
    public devices$(deviceManagerId: string, deviceId?: string): Observable<Device> | Observable<ResourceRefs> {
        let devMgrUrl = this.restPython.deviceManagerUrl(this.baseUrl, deviceManagerId);
        if (deviceId) {
            return this.http
                .get(this.restPython.deviceUrl(devMgrUrl, deviceId))
                .map(response => new Device().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.deviceUrl(devMgrUrl))
                .map(response => deserializeResourceRefs(response.json().devices))
                .catch(this.handleError);
        }
    }

    protected reconfigure(id: string) {
        if (this._uniqueId) {
            this.odmListener.disconnect(this._uniqueId);
        }
        super.reconfigure(id);
        this.odmListener.connect(this.uniqueId);
    }
}
