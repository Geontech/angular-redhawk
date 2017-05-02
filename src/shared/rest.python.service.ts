import {
    Injectable,
    InjectionToken
} from '@angular/core';

export const REST_PYTHON_HOST = new InjectionToken<string>('REST_PYTHON_HOST');
export const REST_PYTHON_PORT = new InjectionToken<number>('REST_PYTHON_PORT');
export const REST_PYTHON_API_URL = new InjectionToken<string>('REST_PYTHON_API_URL');

@Injectable()
export class RestPythonService {
    private baseUrl: string;
    
    constructor(host: string, port: number, apiUrl: string) {
        // Defaults
        host = host || window.location.hostname;
        port = port || +window.location.port; // converts to number
        apiUrl = apiUrl || '/redhawk/rest';
        this.baseUrl = host + ':' + port + apiUrl;
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
        return this.baseWebsocketUrl(portUrl, '/bulkio');
    }

    redhawkSocketUrl(): string {
        return this.baseWebsocketUrl('/redhawk');
    }

    eventSocketUrl(): string {
        return this.baseWebsocketUrl('/events');
    }
}
