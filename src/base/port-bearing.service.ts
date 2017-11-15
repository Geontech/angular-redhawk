import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BaseService } from './base.service';

import {
    Port,
    Ports,
    deserializePort,
    deserializePorts
} from '../models/index';

/**
 * Abstract service extension that adds the ability to fetch the Port model.
 */
export abstract class PortBearingService<T> extends BaseService<T> {

    /**
     * Gets the port via its name or a port listing if no name is provided.
     * @param portName The name of the port
     */
    ports$(portName?: string): Observable<Port> | Observable<Ports> {
        if (portName) {
            return this.http
                .get(this.restPython.portUrl(this.baseUrl, portName))
                .map(response => deserializePort(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(this.restPython.portUrl(this.baseUrl))
                .map(response => deserializePorts(response.json().ports))
                .catch(this.handleError);
        }
    }
}
