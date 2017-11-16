import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// This model and base class
import { FileSystem }  from '../models/index';
import { BaseService } from '../base/index';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent Service
import { DomainService } from '../domain/domain.module';


@Injectable()
export class FileSystemService extends BaseService<FileSystem> {
    /**
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     * @param domainService The Domain service that has this FileSystem in it
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
    ) {
        super(http, restPython);
        this.modelUpdated(new FileSystem());
    }

    /**
     * Internal, sets up the base URL
     * @param url Sets the base URL for this service
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.fileSystemUrl(this.domainService.baseUrl, url);
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     */
    uniqueQuery$(): Observable<FileSystem> {
        return this.http
            .get(this.baseUrl)
            .map(response => new FileSystem().deserialize(response.json()));
    }
}
