import {
    Injectable,
    InjectionToken
} from '@angular/core';

import { IRestPythonConfig } from './rest.python.config';

export const REST_PYTHON_CONFIG = new InjectionToken<IRestPythonConfig>('REST_PYTHON_CONFIG');

export function configureRestPythonService(config: IRestPythonConfig): RestPythonService {
    config = config || {};
    const s = new RestPythonService(config);
    return s;
}

export function restPythonServiceProvider(): any {
    return [
        {
            provide: RestPythonService,
            useFactory: configureRestPythonService,
            deps: [ REST_PYTHON_CONFIG ]
        }
    ];
}

@Injectable()
export class RestPythonService {
    private baseUrl: string;

    constructor(config: IRestPythonConfig) {
        // Defaults
        let host = config.host || window.location.hostname;
        let port = config.port || +window.location.port; // converts to number
        let apiUrl = config.apiUrl || '/redhawk/rest';
        this.baseUrl = host + ':' + port + apiUrl;
    }

    redhawkUrl(): string {
        return this.baseRestUrl('');
    }

    eventChannelsUrl(): string {
        return this.baseRestUrl('/events/');
    }

    domainUrl(parentUrl: string, domainId?: string): string {
        return this.baseRestUrl(parentUrl, '/domains', domainId);
    }

    fileSystemUrl(parentUrl: string, path?: string): string {
        return this.baseRestUrl(parentUrl, '/fs', path);
    }

    deviceManagerUrl(parentUrl: string, deviceManagerId?: string): string {
        return this.baseRestUrl(parentUrl, '/deviceManagers', deviceManagerId);
    }

    deviceUrl(parentUrl: string, deviceId?: string): string {
        return this.baseRestUrl(parentUrl, '/devices', deviceId);
    }

    serviceUrl(parentUrl: string, serviceId?: string): string {
        return this.baseRestUrl(parentUrl, '/services', serviceId);
    }

    waveformUrl(parentUrl: string, waveformId?: string): string {
        return this.baseRestUrl(parentUrl, '/applications', waveformId);
    }

    componentUrl(parentUrl: string, componentId?: string): string {
        return this.baseRestUrl(parentUrl, '/components', componentId);
    }

    propertyUrl(parentUrl: string): string {
        return this.baseRestUrl(parentUrl, '/properties');
    }

    portUrl(parentUrl: string, portId?: string): string {
        return this.baseRestUrl(parentUrl, '/ports', portId);
    }

    bulkioSocketUrl(portUrl: string): string {
        // Pop service off the front, if present.
        let base_url_re = new RegExp(this.baseUrl.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        let svc_re = /^https?\:\/{1,2}/i;

        portUrl = portUrl.replace(base_url_re, "");
        portUrl = portUrl.replace(svc_re, "");
        return this.baseWebsocketUrl(portUrl, '/bulkio');
    }

    redhawkSocketUrl(): string {
        return this.baseWebsocketUrl('/redhawk');
    }

    eventSocketUrl(): string {
        return this.baseWebsocketUrl('/events');
    }

    private baseWebsocketUrl(parentUrl: string, subPath?: string): string {
        let path = ((window.location.protocol === 'https:') ? 'wss:' : 'ws:') + '//';
        path += this.baseUrl + parentUrl;
        if (subPath) {
            path += subPath;
        }
        return path;
    }

    private baseRestUrl(parentUrl: string, subPath?: string, target?: string): string {
        let server = window.location.protocol + '//' + this.baseUrl;
        if (parentUrl.lastIndexOf(server) >= 0) {
            server = ''; // Already added.
        }

        if (subPath) {
            if (target) {
                return server + parentUrl + subPath + '/' + target;
            }
            return server + parentUrl + subPath;
        }
        return server + parentUrl;
    }
}
