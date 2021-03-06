import { Http }          from '@angular/http';
import { Observable }    from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription }  from 'rxjs/Subscription';

import 'rxjs/add/observable/throw';

import { IServiceConfigured } from './service-configured';
import { RestPythonService } from '../rest-python/rest-python.module';

/**
 * The BaseService class is an abstract base class for all REST-Python -facing
 * service interfaces back to the REDHAWK system.  The premise of these classes
 * is that once injected, setting the uniqueId begins a process of pulling the 
 * initial state of the model (which can be observed at model$).  There 
 * forward, calling update() should be enough to maintain the model.
 *
 * Derived classes may also instantiate additional websocket service interfaces.
 * Please refer to the associated class for more information.
 */
export abstract class BaseService<T> {
    /** Returns true if this service is in the middle of updating the model */
    get isUpdating(): boolean { return this._updating; }

    /**
     * Indicates the 'configured' state of the service.  This will be 'true' if
     * the URL is set.
     */
    get configured$(): Observable<IServiceConfigured> { return this._configured.asObservable(); }

    /** Unique ID of the server-side instance for this service */
    protected _uniqueId: string;

    /** Base REST URL of this service instance */
    protected _baseUrl: string;

    /** The internal model managed by this service */
    protected _model: ReplaySubject<T>;

    /** Flag for whether or not this service is setup */
    protected _configured: ReplaySubject<IServiceConfigured>;

    /** Internal updating flag */
    protected _updating: boolean;

    /** Internal subscription to RP Service Updates */
    protected _rpChanged: Subscription;

    /** 
     * Set the unique ID of the underlying system
     * NOTE: This will cause the service to reconfigure (update).
     * @param id The new UniqueID
     */
    set uniqueId(id: string) {
        this.reconfigure(id);
    }

    /** Get the unique ID of the underlying system */
    get uniqueId(): string {
        return this._uniqueId;
    }

    /** Get the Base (REST) URL of this system */
    get baseUrl(): string {
        return this._baseUrl;
    }

    /** Get an observable of this service's model */
    get model$(): Observable<T> {
        return this._model.asObservable();
    }

    /**
     * Constructor
     * @param http The HTTP service for server callbacks
     * @param restPython The REST Python service for URL serialization
     */
    constructor(protected http: Http, protected restPython: RestPythonService) {
        this._model = new ReplaySubject<T>();
        this._configured = new ReplaySubject<IServiceConfigured>();
        this._configured.next({ success: false, uriChanged: false });
        this._updating = false;
        this._rpChanged = this.restPython.changed$.subscribe(() => {
            // Ensures that when RP URL is changed, the service tries to 
            // reconnect to the server.            
            this.reconfigure(this.uniqueId);
        });
    }

    /**
     * Pass the observable to this method to update your local model
     * NOTE: Setting the uniqueID of this service triggers this update.
     *
     * @param {Observable<T>} obj An optional model to make the "next" model
     *        subscribers will see.
     * @param {boolean} uriChanged An optional flag indicating if this update
     *        was because of a URI change (end point change)
     */
    public update(obj?: Observable<T>, uriChanged = false) {
        this._updating = true;
        let inst: Observable<T> = obj || this.uniqueQuery$();
        inst.subscribe(
            o => {
                this.modelUpdated(o);
                this._configured.next({ success: true, uriChanged: uriChanged });
            },
            error => {
                this._configured.next({ success: false, uriChanged: uriChanged });
            },
            () => {
                this._updating = false;
            }
        );
    }

    /**
     *  Get an instance of the _model and configure any automated maintenance of
     *  that instance.  Also setup _baseUrl to this instance.
     */
    protected abstract uniqueQuery$(): Observable<T>;

    /** Update _baseUrl */
    protected abstract setBaseUrl(url: string): void;

    /** Generic error handler */
    protected handleError(error: any): Observable<any> {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }

    /**
     * Call this method from a function that needs a slight delay (for the server)
     * before calling update.
     * @param msec The number of milliseconds to delay
     */
    protected delayedUpdate(msec?: number) {
        setTimeout(() => { this.update(); }, msec || 1000);
    }

    /**
     * This method is called when the uniqueId is set and begins the update cycle
     * which includes reconfiguring the base URL and retrieving a fresh copy
     * of the model for any subscribers to $model.
     * @param id The new Unique ID to set for reconfiguration.
     * @param force Force a reconfiguration of the service (end point(s), etc.). 
     */
    protected reconfigure(id: string, force = false) {
        let changed: boolean = (id !== this._uniqueId || force);
        this._uniqueId = id;
        this.setBaseUrl(id);
        this.update(undefined, changed);
    }

    /**
     * This method is called during update() calls and pushes the model to any
     * subscribers of $model.  Subclasses can overload this method to either
     * call it before or after internal changes are made related to the model.
     * @param model The model maintained by this service.
     */
    protected modelUpdated(model: T) {
        this._model.next(model);
    }
}
