import {
    Optional,
    Inject,
    Injectable
} from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import {
    IRestPythonConfig,
    REST_PYTHON_CONFIG
} from './rest-python-config';

@Injectable()
export class RestPythonService {
    // Storage for setters
    private _host:   string;
    private _port:   number;
    private _apiUrl: string;

    private _changed = new Subject<void>();

    private get baseUrl(): string {
        return this.host + ':' + this.port + this.apiUrl;
    }

    /**
     * Be notified when the REST Python Service's URL changes in any way.
     */
    get changed$(): Observable<void> { return this._changed.asObservable(); }

    /** The configured host address for the REST-Python server */
    get host(): string { return this._host; }

    /** The configured port for the REST-Python server */
    get port(): number { return this._port; }

    /** The configured API URL for the REST-Python server */
    get apiUrl(): string { return this._apiUrl; }

    constructor(@Optional() @Inject(REST_PYTHON_CONFIG) config: IRestPythonConfig) {
        this.setConfiguration(config);
    }

    /**
     * Reconfigure the REST-Python Service to a new service address
     */
    setConfiguration(config: IRestPythonConfig) {
        let changed = false;
        config = config || {};

        if (config.host !== undefined && config.host !== this.host) {
            changed = true;
            this._host = config.host;
        } else if (this.host === undefined) {
            changed = true;
            this._host = window.location.hostname;
        }

        if (config.port !== undefined && config.port !== this.port) {
            changed = true;
            this._port = config.port;
        } else if (this.port === undefined) {
            changed = true;
            this._port = 8080;
        }

        if (config.apiUrl !== undefined && config.apiUrl !== this.apiUrl) {
            changed = true;
            this._apiUrl = config.apiUrl;
        } else if (this.apiUrl === undefined) {
            changed = true;
            this._apiUrl = '/redhawk/rest';
        }

        if (changed === true) {
            this._changed.next();
        }
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
        let baseUrlRE = new RegExp(this.baseUrl.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
        let svcRE = /^https?\:\/{1,2}/i;

        portUrl = portUrl.replace(baseUrlRE, '');
        portUrl = portUrl.replace(svcRE, '');
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
