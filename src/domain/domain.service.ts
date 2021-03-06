import {
    Injectable,
    Optional,
    ReflectiveInjector
} from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Models and base class
import * as models     from '../models/index';
import { BaseService } from '../base/index';

// URL Builder
import { RestPythonService } from '../rest-python/rest-python.module';

// Parent service
import { RedhawkService } from '../redhawk/redhawk.module';

// Command interfaces
import { PropertyCommand } from '../property/property.module';
import {
    IWaveformLaunchCommand,
    IWaveformLaunchCommandResponse
} from '../waveform/waveform.module';

// ODM Socket
import { OdmListenerService } from '../sockets/sockets.module';

/**
 * The Domain Service provides access to the Domain model and other interfaces
 * at the REST server including a socket to the ODM Event Channel for monitoring
 * changes to the Domain (applications coming and going, etc.).
 */
@Injectable()
export class DomainService extends BaseService<models.Domain> {
    /**
     * Constructor
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     * @param redhawkService The REDHAWK service that can contains this Domain
     * @param [odmListener] The ODM Listener Service for tracking Domain events
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected redhawkService: RedhawkService,
        @Optional() protected odmListener: OdmListenerService
    ) {
        super(http, restPython);
        this.modelUpdated(new models.Domain());

        if (!this.odmListener) {
            let injector = ReflectiveInjector.resolveAndCreate([OdmListenerService]);
            this.odmListener = injector.get(OdmListenerService);
        }

        // Bind update() to apps, factories, and device manager changes.
        this.odmListener.applicationAdded$.subscribe(o => this.update());
        this.odmListener.applicationRemoved$.subscribe(o => this.update());
        this.odmListener.applicationFactoryAdded$.subscribe(o => this.update());
        this.odmListener.applicationFactoryRemoved$.subscribe(o => this.update());
        this.odmListener.deviceManagerAdded$.subscribe(o => this.update());
        this.odmListener.deviceManagerRemoved$.subscribe(o => this.update());
    }

    /**
     * Internal, sets up the base URL
     * @param url Sets the base URL for this service
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.domainUrl(this.redhawkService.baseUrl, url);
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     */
    uniqueQuery$(): Observable<models.Domain> {
        return this.redhawkService.attach$(this.uniqueId);
    }


    /**
     * Configures the domain's properties properties
     * @param properties The list of properties to configure
     */
    public configure(properties: models.PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .catch(this.handleError);
        this.delayedUpdate();
    }

    /**
     * Get a list of running apps or a specific instance
     * @param [waveformId] The ID of the waveform model to get.  If none provided, a list is returned.
     * @returns Observable Waveform or ResourceRefs
     */
    public apps$(waveformId?: string): Observable<models.Waveform> | Observable<models.ResourceRefs> {
        if (waveformId) {
            return this.http
                .get(this.restPython.waveformUrl(this.baseUrl, waveformId))
                .map(response => new models.Waveform().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.waveformUrl(this.baseUrl))
                .map(response => models.deserializeResourceRefs(response.json().applications))
                .catch(this.handleError);
        }
    }

    /**
     * Get a list of launchable waveforms
     * Note: this is also on the [Domain's model]{@link Domain#waveforms}
     * @returns Observable WaveformSADRefs
     */
    public catalogSads$(): Observable<models.WaveformSADRefs> {
        return this.http
            .get(this.baseUrl)
            .map(response => models.deserializeWaveformSADRefs(response.json().waveforms))
            .catch(this.handleError);
    }

    /**
     * Launch a waveform
     * @param waveformName The [name]{@link WaveformSAD#name} of the Waveform
     * @param [started] Whether or not to also start (or not) the waveform (default stopped).
     * @returns Obsevable IWaveformLaunchCommandResponse
     */
    public launch$(waveformName: string, started?: boolean): Observable<IWaveformLaunchCommandResponse> {
        let command: IWaveformLaunchCommand = { name: waveformName, started: started || false};
        return this.http
            .post(this.restPython.waveformUrl(this.baseUrl), command)
            .map(response => {
                this.delayedUpdate();
                return response.json() as IWaveformLaunchCommandResponse;
            })
            .catch(this.handleError);
    }

    /**
     * Get a list of device managers or a specific instance
     * @param [deviceManagerId] The device manager model to retrieve.  If none provided, returns a listing.
     * @returns Observable DeviceManager or DeviceManagerRefs
     */
    public devMgrs$(deviceManagerId?: string): Observable<models.DeviceManager> | Observable<models.DeviceManagerRefs> {
        if (deviceManagerId) {
            return this.http
                .get(this.restPython.deviceManagerUrl(this.baseUrl, deviceManagerId))
                .map(response => new models.DeviceManager().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.deviceManagerUrl(this.baseUrl))
                .map(response => models.deserializeDeviceManagerRefs(response.json().deviceManagers))
                .catch(this.handleError);
        }
    }

    /**
     * Get a device model or a listing of available devices
     * @param deviceManagerId The device manager's ID containing the Device(s)
     * @param [deviceId] The device ID to retrieve.  If none, a listing is returned.
     * @returns Observable Device or ResourceRefs
     */
    public devices$(deviceManagerId: string, deviceId?: string): Observable<models.Device> | Observable<models.ResourceRefs> {
        let devMgrUrl = this.restPython.deviceManagerUrl(this.baseUrl, deviceManagerId);
        if (deviceId) {
            return this.http
                .get(this.restPython.deviceUrl(devMgrUrl, deviceId))
                .map(response => new models.Device().deserialize(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.deviceUrl(devMgrUrl))
                .map(response => models.deserializeResourceRefs(response.json().devices))
                .catch(this.handleError);
        }
    }

    /** Common 'reconfigure' method to reconnect to the ODM listener when the uniqueID changes. */
    protected reconfigure(id: string, force = false) {
        if (this._uniqueId) {
            this.odmListener.disconnect(this._uniqueId);
        }
        super.reconfigure(id, force);
        this.odmListener.connect(this.uniqueId);
    }
}
