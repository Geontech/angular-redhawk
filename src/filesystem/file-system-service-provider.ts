import { Optional, SkipSelf, Provider } from '@angular/core';
import { Http } from '@angular/http';

import { RestPythonService } from '../rest-python/rest-python.module';
import { DomainService }     from '../domain/domain.module';

import { FileSystemService } from './file-system.service';

export function serviceSelect(
    service: FileSystemService,
    http: Http,
    restPython: RestPythonService,
    domainService: DomainService): FileSystemService {
    if (service === null) {
        service = new FileSystemService(http, restPython, domainService);
    }
    return service;
}

/**
 * This is a default Service Provider factory that automatically selects the
 * "external" service (if already in the DI graph) or injects a new one using
 * the required set of external dependencies.
 */
export function fileSystemServiceProvider(): Provider[] {
    return [{
        provide:    FileSystemService,
        useFactory: serviceSelect,
        deps: [
            [FileSystemService, new Optional(), new SkipSelf()],
            Http,
            RestPythonService,
            DomainService
        ]
    }];
}
