import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Parent Service & base class
import { DomainService } from '../domain/domain.service';
import { BaseService } from '../shared/base.service';

// URL Builder
import { FileSystemUrl } from '../shared/config.service';

// This model
import { FileSystem } from './filesystem';

@Injectable()
export class FilesystemService extends BaseService<FileSystem> {
    constructor(
        protected http: Http,
        protected domainService: DomainService
        ) { super(http); }

    setBaseUrl(url: string): void {
        this._baseUrl = FileSystemUrl(this.domainService.baseUrl, url);
    }

    uniqueQuery$(): Observable<FileSystem> {
        return this.http
            .get(this.baseUrl)
            .map(response => new FileSystem().deserialize(response.json()));
    }
}
