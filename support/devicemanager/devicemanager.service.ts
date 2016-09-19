import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig }    from '../shared/config.service';
import { DeviceManager } from './devicemanager';


@Injectable()
export class DeviceManagerService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getDeviceManager(domainId: string, deviceManagerId: string): Promise<DeviceManager> {
        return this.http
            .get(this.rpConfig.deviceManagerUrl(domainId, deviceManagerId))
            .toPromise()
            .then(response => response.json() as DeviceManager)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
