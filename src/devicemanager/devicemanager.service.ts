import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent service & base class
import { DomainService } from '../domain/domain.service';
import { BaseService } from '../shared/base.service';

// URL Builders
import { DeviceManagerUrl, ServiceUrl } from '../shared/config.service';

// This model
import { DeviceManager } from './devicemanager';

// Child models
import { ResourceRefs } from '../shared/resource';
import { Device } from '../device/device';


@Injectable()
export class DeviceManagerService extends BaseService<DeviceManager> {

    constructor(
        protected http: Http,
        protected domainService: DomainService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = DeviceManagerUrl(this.domainService.getBaseUrl(), url);
    }

    uniqueQuery$(): Observable<DeviceManager> {
        return <Observable<DeviceManager>> this.domainService.devMgrs$(this.getUniqueId());
    }

    public devs$(deviceId?: string): Observable<Device> | Observable<ResourceRefs> {
        return this.domainService.devices$(this.getUniqueId(), deviceId);
    }

    public services$(serviceId?: string): Observable<any> | Observable<any[]> {
        if (serviceId) {
            return this.http
                .get(ServiceUrl(this.getBaseUrl(), serviceId))
                .map(response => response.json())
                .catch(this.handleError);
        } else {
            return this.http
                .get(ServiceUrl(this.getBaseUrl()))
                .map(response => response.json().services)
                .catch(this.handleError);
        }
    }
}
