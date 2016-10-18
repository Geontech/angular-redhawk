import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { RedhawkService } from '../redhawk/redhawk.service';
import { BaseService }    from '../shared/base.service';

// URL Builders
import {
    DomainUrl,
    DeviceManagerUrl,
    WaveformUrl,
    DeviceUrl,
    PropertyUrl
} from '../shared/config.service';

// This model
import { Domain } from './domain';

// Child models
import {
    Waveform,
    WaveformSADRefs,
    WaveformLaunchCommand,
    WaveformLaunchCommandResponse
} from '../waveform/waveform';
import { DeviceManager, DeviceManagerRefs } from '../devicemanager/devicemanager';
import { Device } from '../device/device';
import { ResourceRefs } from '../shared/resource';
import { PropertySet, PropertyCommand } from '../property/property';

@Injectable()
export class DomainService extends BaseService<Domain> {
    constructor(
        protected http: Http,
        protected redhawkService: RedhawkService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = DomainUrl(this.redhawkService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Domain> {
        return this.redhawkService.attach$(this.uniqueId);
    }

    // Configure properties
    public configure(properties: PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http
            .put(PropertyUrl(this.baseUrl), command)
            .map(response => this.update())
            .catch(this.handleError);
    }

    // Get a list of running apps or a specific instance
    public apps$(waveformId?: string): Observable<Waveform> | Observable<ResourceRefs> {
        if (waveformId) {
            return this.http
                .get(WaveformUrl(this.baseUrl, waveformId))
                .map(response => response.json() as Waveform)
                .catch(this.handleError);
        } else {
            return this.http
                .get(WaveformUrl(this.baseUrl))
                .map(response => response.json().applications as ResourceRefs)
                .catch(this.handleError);
        }
    }

    // Get a list of launchable waveforms
    public catalogSads$(): Observable<WaveformSADRefs> {
        return this.http
            .get(WaveformUrl(this.baseUrl))
            .map(response => response.json().waveforms as WaveformSADRefs)
            .catch(this.handleError);
    }

    // Launch a waveform
    public launch$(waveformName: string, started?: boolean): Observable<WaveformLaunchCommandResponse> {
        let command = new WaveformLaunchCommand(waveformName, started || false);
        return this.http
            .post(WaveformUrl(this.baseUrl), command)
            .map(response => response.json() as WaveformLaunchCommandResponse)
            .catch(this.handleError);
    }

    // Get a list of device managers or a specific instance
    public devMgrs$(deviceManagerId?: string): Observable<DeviceManager> | Observable<DeviceManagerRefs> {
        if (deviceManagerId) {
            return this.http
                .get(DeviceManagerUrl(this.baseUrl, deviceManagerId))
                .map(response => response.json() as DeviceManager)
                .catch(this.handleError);
        } else {
            return this.http
                .get(DeviceManagerUrl(this.baseUrl))
                .map(response => response.json().deviceManagers as DeviceManagerRefs)
                .catch(this.handleError);
        }
    }

    // Get a list of devices or a specific instance
    public devices$(deviceManagerId: string, deviceId?: string): Observable<Device> | Observable<ResourceRefs> {
        let devMgrUrl = DeviceManagerUrl(this.baseUrl, deviceManagerId);
        if (deviceId) {
            return this.http
                .get(DeviceUrl(devMgrUrl, deviceId))
                .map(response => response.json() as Device)
                .catch(this.handleError);
        } else {
            return this.http
                .get(DeviceUrl(devMgrUrl))
                .map(response => response.json().devices as ResourceRefs)
                .catch(this.handleError);
        }
    }
}
