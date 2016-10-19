import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

export abstract class BaseService<T> {

    // Unique ID of the server-side instance for this service
    protected _uniqueId: string;

    // Base REST URL of this service instance
    protected _baseUrl: string;

    // The internal model managed by this service
    protected _model: Subject<T>;

    // Flag for whether or not this service is setup
    protected _configured: boolean = false;

    constructor(protected http: Http) {
        this._model = <Subject<T>> new Subject();
    }

    set uniqueId(id: string) {
        this._uniqueId = id;
        this.setBaseUrl(id);
        this.update();
        this._configured = true;
    }

    get uniqueId(): string {
        return this._uniqueId;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get model$(): Observable<T> {
        if (!this._configured) {
            console.error('UniqueId Not set!');
        }
        return this._model.asObservable();
    }

    /**
     * Pass the observable to this method to update your local model
     * NOTE: Setting the uniqueID of this service triggers this update.
     *
     * @param {Observable<T>} obj An optional model to make the "next" model
     *        subscribers will see.
     */
    public update(obj?: Observable<T>) {
        let inst: Observable<T> = obj || this.uniqueQuery$();
        inst.subscribe(o => this._model.next(o));
    }

    // Get an instance of the _model and configure any automated maintenance of
    // that instance.  Also setup _baseUrl to this instance
    protected abstract uniqueQuery$(): Observable<T>;

    // Update _baseUrl
    protected abstract setBaseUrl(url: string): void;

    protected handleError(error: any): Observable<any> {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    /**
     * Call this method from a function that needs a slight delay (for the server)
     * before calling update.
     */
    protected delayedUpdate(msec?: number) {
        setTimeout(() => { this.update(); }, msec || 1000);
    }
}
