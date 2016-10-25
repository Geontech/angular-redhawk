import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { DeviceManagerService } from '../devicemanager/devicemanager.service';
import { PortBearingService } from '../port/port.interface';

// URL builders
import {
    DeviceUrl,
    PropertyUrl
} from '../shared/config.service';

// This model and helpers
import {
    Device,
    DevicePropertyCommand,
    IDevicePropertyCommandResponse
} from './device';

// Child models
import { PropertySet } from '../property/property';

@Injectable()
export class DeviceService extends PortBearingService<Device> {

    constructor(
        protected http: Http,
        protected dmService: DeviceManagerService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = DeviceUrl(this.dmService.baseUrl, url);
    }

    uniqueQuery$(): Observable<Device> {
        return <Observable<Device>> this.dmService.devs$(this.uniqueId);
    }

    public configure$(properties: PropertySet): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('configure', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    public allocate$(properties: PropertySet): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('allocate', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    public deallocate$(properties: PropertySet): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('deallocate', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    private sendDevicePropertyCommand$(command: DevicePropertyCommand): Observable<IDevicePropertyCommandResponse> {
        return this.http
            .put(PropertyUrl(this.baseUrl), command)
            .map(response => {
                    this.delayedUpdate();
                    return response.json() as IDevicePropertyCommandResponse;
                })
            .catch(this.handleError);
    }
}
