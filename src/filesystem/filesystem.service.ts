import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent Service & base class
import { DomainService } from '../domain/domain.service';
import { BaseService } from '../base/base.service';

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
        this._baseUrl = this.restPython.fileSystemUrl(this.domainService.baseUrl, url);
    }

    uniqueQuery$(): Observable<FileSystem> {
        return this.http
            .get(this.baseUrl)
            .map(response => new FileSystem().deserialize(response.json()));
    }
}
