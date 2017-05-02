import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent Service & base class
import { DomainService } from '../domain/domain.service';
import { BaseService } from '../shared/base.service';

// URL Builder
import { RestPythonService } from '../shared/rest.python.service';

// This model
import { FileSystem } from './filesystem';

@Injectable()
export class FilesystemService extends BaseService<FileSystem> {
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
        ) { super(http, restPython); }

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.fileSystemUrl(this.domainService.getBaseUrl(), url);
    }

    uniqueQuery$(): Observable<FileSystem> {
        return this.http
            .get(this.getBaseUrl())
            .map(response => new FileSystem().deserialize(response.json()));
    }
}
