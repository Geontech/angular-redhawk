import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RESTConfig } from '../shared/config.service';
import { Filesystem } from './filesystem'


@Injectable()
export class FilesystemService {
    constructor(
        private http: Http,
        private rpConfig: RESTConfig
        ) {}
    
    public getFilesystem(domainId: string, path: string): Promise<Filesystem> {
        return this.http
            .get(this.rpConfig.filesystemUrl(domainId, path))
            .toPromise()
            .then(response => response.json() as Filesystem)
            .catch(this.handleError);
    }

    public launch(domainId: string, waveformId: string) {
        // TODO: Implement
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
