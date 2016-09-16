import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from './config.service';
import { Device } from '../models/device';


@Injectable()
export class DeviceService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getDevice(domainId: string, deviceManagerId: string, deviceId: string): Promise<Device> {
        return this.http
            .get(this.rpConfig.deviceUrl(domainId, deviceManagerId, deviceId))
            .toPromise()
            .then(response => response.json() as Device)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
