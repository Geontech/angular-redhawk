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

/**
 * The REST Python (URL) Service provides generation of the URL end points of the
 * REST Python server.  Aided by dependency injection between services, this service
 * builds URL structures so that a Device Manager can infer its Domain's end point,
 * a Device can infer the Device Manager's end point, and so on.
 */
@Injectable()
export class RestPythonService {
    /** REST Python host address */
    private _host:   string;
    /** REST Python host port */
    private _port:   number;
    /** REST Python API URL (top-level endpoint) */
    private _apiUrl: string;

    /** Subject for indicating if the REST configuration changed at runtime */
    private _changed = new Subject<void>();

    /** Base URL of the REST Python Service */
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

    /**
     * Constructor
     * @param config The REST Python Configuration
     */
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

    /** URL for the REDHAWK interface */
    redhawkUrl(): string {
        return this.baseRestUrl('');
    }

    /** URL for the Event Channels listing */
    eventChannelsUrl(): string {
        return this.baseRestUrl('/events/');
    }

    /** URL for the/a Domain's interface */
    domainUrl(parentUrl: string, domainId?: string): string {
        return this.baseRestUrl(parentUrl, '/domains', domainId);
    }

    /** URL for a FIle System interface */
    fileSystemUrl(parentUrl: string, path?: string): string {
        return this.baseRestUrl(parentUrl, '/fs', path);
    }

    /** URL for a Device Manager listing or a specific instance */
    deviceManagerUrl(parentUrl: string, deviceManagerId?: string): string {
        return this.baseRestUrl(parentUrl, '/deviceManagers', deviceManagerId);
    }

    /** URL for a Device listing or a specific instance */
    deviceUrl(parentUrl: string, deviceId?: string): string {
        return this.baseRestUrl(parentUrl, '/devices', deviceId);
    }

    /** URL for a Service listing or a specific instance */
    serviceUrl(parentUrl: string, serviceId?: string): string {
        return this.baseRestUrl(parentUrl, '/services', serviceId);
    }

    /** URL for a Waveform listing or a specific instance */
    waveformUrl(parentUrl: string, waveformId?: string): string {
        return this.baseRestUrl(parentUrl, '/applications', waveformId);
    }

    /** URL for a Component listing or a specific instance */
    componentUrl(parentUrl: string, componentId?: string): string {
        return this.baseRestUrl(parentUrl, '/components', componentId);
    }

    /** URL for the properties listing on an interface */
    propertyUrl(parentUrl: string): string {
        return this.baseRestUrl(parentUrl, '/properties');
    }

    /** URL for a Port listing or a specific instance */
    portUrl(parentUrl: string, portId?: string): string {
        return this.baseRestUrl(parentUrl, '/ports', portId);
    }

    /** URL for a port's BULKIO WebSocket interface (if applicable) */
    bulkioSocketUrl(portUrl: string): string {
        // Pop service off the front, if present.
        let baseUrlRE = new RegExp(this.baseUrl.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
        let svcRE = /^https?\:\/{1,2}/i;

        portUrl = portUrl.replace(baseUrlRE, '');
        portUrl = portUrl.replace(svcRE, '');
        return this.baseWebsocketUrl(portUrl, '/bulkio');
    }

    /** URL of the REDHAWK (Domain) Listener WebSocket (i.e., Domains coming and going) */
    redhawkSocketUrl(): string {
        return this.baseWebsocketUrl('/redhawk');
    }

    /** URL for subscribing to Event Channels (WebSocket) */
    eventSocketUrl(): string {
        return this.baseWebsocketUrl('/events');
    }

    /**
     * Returns a websocket URL from the provided URL and path
     * @param parentUrl The parent (service) URL
     * @param [subPath] A sub-path to extend on the URL
     */
    private baseWebsocketUrl(parentUrl: string, subPath?: string): string {
        let path = ((window.location.protocol === 'https:') ? 'wss:' : 'ws:') + '//';
        path += this.baseUrl + parentUrl;
        if (subPath) {
            path += subPath;
        }
        return path;
    }

    /**
     * Creates a URL from the parent's and some new end point details.
     * @param parentUrl The parent (service's) URL
     * @param [subPath] A sub-path extending off the parent's URL 
     * @param [target] A REST end point combining the above URL elements.
     */
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
