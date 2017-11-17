import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DeviceManager, ResourceRefs, Device } from '../models/index';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service & base class
import { DomainService } from '../domain/domain.module';
import { BaseService } from '../base/index';

/**
 * The DeviceManagerService provides access to methods for retrieving the DeviceManager model
 * as well as models of its devices and services.
 */
@Injectable()
export class DeviceManagerService extends BaseService<DeviceManager> {

    /**
     * Constructor
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     * @param domainService The Domain service that has this DeviceManager in it
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
    ) {
        super(http, restPython);
        this.modelUpdated(new DeviceManager());
    }

    /**
     * Internal, sets up the base URL
     * @param url Sets the base URL for this service
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.deviceManagerUrl(this.domainService.baseUrl, url);
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     * @returns Observable DeviceManager
     */
    uniqueQuery$(): Observable<DeviceManager> {
        return <Observable<DeviceManager>> this.domainService.devMgrs$(this.uniqueId);
    }

    /**
     * Retrieve a specific device or a list of devices in the Device Manager
     * @param [deviceId] The Device model to fetch.  If none, a list is returned.
     * @returns Observable Device or ResourceRefs
     */
    public devs$(deviceId?: string): Observable<Device> | Observable<ResourceRefs> {
        return this.domainService.devices$(this.uniqueId, deviceId);
    }

    /**
     * Retrieve a specific service model or list of services in the Device Manager
     * **Note:** Services are not fully supported at this time.
     * 
     * @param [serviceId] The Service model to fetch.  If none, a list is returned.
     * @returns Observable any or list of anys.
     */
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
