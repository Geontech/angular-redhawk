import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Base class, served model and properties
import { PropertySet, Device } from '../models/index';
import { PortBearingService } from '../base/index';
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service
import { DeviceManagerService } from '../devicemanager/device-manager.module';

// This model and helpers
import { DevicePropertyCommand } from './device-property-command';
import { IDevicePropertyCommandResponse } from './device-property-command-response';

/**
 * The default delay in checking for a server response when using configure,
 * allocate, or deallocate.
 */
let DEFAULT_DELAY_RESPONSE_MS = 10000;

/**
 * The Device Service provides access to the Device Model on the REST server as well as
 * serves as methods for controlling it and its ports and properties.
 */
@Injectable()
export class DeviceService extends PortBearingService<Device> {
    /**
     * Constructor
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     * @param dmService The DeviceManager service that has this Device in it
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected dmService: DeviceManagerService
    ) {
        super(http, restPython);
        this.modelUpdated(new Device());
    }

    /**
     * Internal, sets up the base URL
     * @param url Sets the base URL for this service
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.deviceUrl(this.dmService.baseUrl, url);
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     */
    uniqueQuery$(): Observable<Device> {
        return <Observable<Device>> this.dmService.devs$(this.uniqueId);
    }

    /**
     * Calls 'configure' on the Device and then pulls an update of the model.
     * @param properties The properties to 'configure' on the Device
     * @param responseDelayMs The optional model update delay after sending the 
     * changes.
     */
    public configure$(
        properties: PropertySet,
        responseDelayMs?: number,
    ): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('configure', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    /**
     * Calls 'allocate' on the Device and then pulls an update of the model.
     * @param properties The properties to 'allocate' on the Device
     * @param responseDelayMs The optional model update delay after sending the 
     * changes.
     */
    public allocate$(
        properties: PropertySet,
        responseDelayMs?: number,
    ): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('allocate', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    /**
     * Calls 'deallocate' on the Device and then pulls an update of the model.
     * @param properties The properties to 'deallocate' on the Device
     * @param responseDelayMs The optional model update delay after sending the 
     * changes (default is 5000 Ms)
     */
    public deallocate$(
        properties: PropertySet,
        responseDelayMs?: number,
    ): Observable<IDevicePropertyCommandResponse> {
        let command = new DevicePropertyCommand('deallocate', properties);
        return this.sendDevicePropertyCommand$(command);
    }

    /**
     * Common device property command method
     * @internal
     * @param command The command to issue
     * @param responseDelayMs Any delay (milliseconds to delay before the model is updated)
     */
    private sendDevicePropertyCommand$(
        command: DevicePropertyCommand,
        responseDelayMs?: number
    ): Observable<IDevicePropertyCommandResponse> {
        return this.http
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .map(response => {
                    this.delayedUpdate(responseDelayMs || DEFAULT_DELAY_RESPONSE_MS);
                    return response.json() as IDevicePropertyCommandResponse;
                })
            .catch(this.handleError);
    }
}
