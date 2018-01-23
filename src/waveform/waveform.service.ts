import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Model, base class, other external modules
import { Waveform, Component, ResourceRefs, PropertySet } from '../models/index';
import { RestPythonService }                 from '../rest-python/rest-python.module';
import { PortBearingService }                from '../base/index';
import { DomainService }                     from '../domain/domain.module';
import { PropertyCommand }                   from '../property/property.module';

// C&C interfaces
import { IWaveformControlCommand }         from './waveform-control-command';
import { IWaveformControlCommandResponse } from './waveform-control-command-response';
import { IWaveformReleaseResponse }        from './waveform-release-response';

/**
 * The default delay in checking for a server response when using configure,
 * allocate, or deallocate.
 */
let DEFAULT_DELAY_RESPONSE_MS = 10000;

/**
 * The Waveform Service provides access to the Waveform Model on the REST server as well as
 * access to its components, ports, and properties.
 */
@Injectable()
export class WaveformService extends PortBearingService<Waveform> {

    /**
     * Constructor
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     * @param domainService The Domain service that can contains this Waveform
     */
    constructor(
        protected http: Http,
        protected restPython: RestPythonService,
        protected domainService: DomainService
    ) {
        super(http, restPython);
        this.modelUpdated(new Waveform());
    }

    /**
     * Internal, sets up the base URL
     * @param url Sets the base URL for this service
     */
    setBaseUrl(url: string): void {
        this._baseUrl = this.restPython.waveformUrl(this.domainService.baseUrl, url);
    }

    /**
     * Internal, initiates the server call that uniquely identifies this entity
     * to retrieve its model.
     */
    uniqueQuery$(): Observable<Waveform> {
        return <Observable<Waveform>> this.domainService.apps$(this.uniqueId);
    }

    /**
     * Returns an observable Component model if the Component ID is provided and exists.
     * If no ID is provided, this provides a reference listing of the components in the
     * Waveform.
     * @param [componentId] The Component ID to retrieve
     */
    public comps$(componentId?: string): Observable<Component> | Observable<ResourceRefs> {
        if (componentId) {
            return this.http
                .get(this.restPython.componentUrl(this.baseUrl, componentId))
                .map(response => response.json() as Component)
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.componentUrl(this.baseUrl))
                .map(response => response.json().components as ResourceRefs)
                .catch(this.handleError);
        }
    }

    /**
     * Starts the Waveform and returns the success/failure of that command.
     */
    public start$(): Observable<IWaveformControlCommandResponse> {
        let command: IWaveformControlCommand = { started: true };
        return this.controlCommand$(command);
    }

    /**
     * Stops the Waveform and returns the success/failure of that command.
     */
    public stop$(): Observable<IWaveformControlCommandResponse> {
        let command: IWaveformControlCommand = { started: false };
        return this.controlCommand$(command);
    }

    /**
     * Releases (removes) the Waveform and returns confirmation.
     */
    public release$(): Observable<IWaveformReleaseResponse> {
        return this.http
            .delete(this.baseUrl)
            .map(response => response.json() as IWaveformReleaseResponse)
            .catch(this.handleError);
    }

    /**
     * Calls 'configure' on the Application and then pulls an update of the model.
     * @param properties The properties to 'configure' on the Application
     * @param delayResponseMs The optional model update delay after sending the 
     * changes.
     */
    configure$(properties: PropertySet, delayResponseMs?: number): Observable<any> {
        let command = new PropertyCommand(properties);
        return this.http
            .put(this.restPython.propertyUrl(this.baseUrl), command)
            .map(response => {
                this.delayedUpdate(delayResponseMs || DEFAULT_DELAY_RESPONSE_MS);
                return response; // This will be null/undefined/empty
            })
            .catch(this.handleError);
    }

    /**
     * Common method shared by start and stop for issuing the command to the server.
     * @param command The command to issue (start/stop)
     */
    private controlCommand$(command: IWaveformControlCommand): Observable<IWaveformControlCommandResponse> {
        return this.http
            .put(this.baseUrl, command)
            .map(response => response.json() as IWaveformControlCommandResponse)
            .catch(this.handleError);
    }
}
