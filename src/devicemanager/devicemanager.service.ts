import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';


// Parent service & base class
import { DomainService } from '../domain/domain.service';
import { BaseService } from '../base/base.service';

// This model
import { DeviceManager } from './devicemanager';

// Child models
import { ResourceRefs } from '../base/resource';
import { Device } from '../device/device';


@Injectable()
export class DeviceManagerService extends BaseService<DeviceManager> {

    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
        ) { super(http, restPython); }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.deviceManagerUrl(this.domainService.baseUrl, url);
    }

    uniqueQuery$(): Observable<DeviceManager> {
        return <Observable<DeviceManager>> this.domainService.devMgrs$(this.uniqueId);
    }

    public devs$(deviceId?: string): Observable<Device> | Observable<ResourceRefs> {
        return this.domainService.devices$(this.uniqueId, deviceId);
    }

    public services$(serviceId?: string): Observable<any> | Observable<any[]> {
        if (serviceId) {
            return this.http
                .get(this.restPython.serviceUrl(this.baseUrl, serviceId))
                .map(response => response.json())
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.serviceUrl(this.baseUrl))
                .map(response => response.json().services)
                .catch(this.handleError);
        }
    }
}
