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
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected redhawkService: RedhawkService,
        @Optional() protected odmListener: OdmListenerService
        ) {
        super(http, restPython);

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

    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.domainUrl(this.redhawkService.baseUrl, url);
    }

    uniqueQuery$(): Observable<models.Domain> {
        return this.redhawkService.attach$(this.uniqueId);
    }


    // Configure properties
    public configure(properties: models.PropertySet): void {
        let command = new PropertyCommand(properties);
        this.http
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .catch(this.handleError);
        this.delayedUpdate();
    }

    // Get a list of running apps or a specific instance
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

    // Get a list of launchable waveforms
    public catalogSads$(): Observable<models.WaveformSADRefs> {
        return this.http
            .get(this.restPython.waveformUrl(this.baseUrl))
            .map(response => models.deserializeWaveformSADRefs(response.json().waveforms))
            .catch(this.handleError);
    }

    // Launch a waveform
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

    // Get a list of device managers or a specific instance
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

    // Get a list of devices or a specific instance
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

    protected reconfigure(id: string) {
        if (this._uniqueId) {
            this.odmListener.disconnect(this._uniqueId);
        }
        super.reconfigure(id);
        this.odmListener.connect(this.uniqueId);
    }
}
