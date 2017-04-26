import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BaseService } from '../shared/base.service';

import { PortUrl } from '../shared/config.service';

import {
    Port,
    Ports,
    deserializePort,
    deserializePorts
} from './port';

export abstract class PortBearingService<T> extends BaseService<T> {
    ports$(portName?: string): Observable<Port> | Observable<Ports> {
        if (portName) {
            return this.http
                .get(PortUrl(this.getBaseUrl(), portName))
                .map(response => deserializePort(response.json()))
                .catch(this.handleError);
        } else {
            return this.http
                .get(PortUrl(this.getBaseUrl()))
                .map(response => deserializePorts(response.json().ports))
                .catch(this.handleError);
        }
    }
}
