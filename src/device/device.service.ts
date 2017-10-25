import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Base class, served model and properties
import { PropertySet, Device } from '../models/index';
import { PortBearingService } from '../base/index';
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service
import { DeviceManagerService } from '../devicemanager/device-manager.module';

// This model and helpers
import { DevicePropertyCommand } from './device-property-command';
import { IDevicePropertyCommandResponse } from './device-property-command-response';

@Injectable()
export class DeviceService extends PortBearingService<Device> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected dmService: DeviceManagerService
        ) { super(http, restPython); }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.deviceUrl(this.dmService.baseUrl, url);
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
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .map(response => {
                    this.delayedUpdate();
                    return response.json() as IDevicePropertyCommandResponse;
                })
            .catch(this.handleError);
    }
}
