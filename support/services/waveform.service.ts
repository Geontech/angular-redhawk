import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from './config.service';
import { Waveform } from '../models/waveform';


@Injectable()
export class WaveformService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}

    public getWaveform(domainId: string, waveformId: string): Promise<Waveform> {
        return this.http
            .get(this.rpConfig.waveformUrl(domainId, waveformId))
            .toPromise()
            .then(response => response.json() as Waveform)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
