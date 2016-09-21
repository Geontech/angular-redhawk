import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BaseService } from '../shared/base.service';

import { PortUrl } from '../shared/config.service';

import { Port } from './port';

export abstract class PortBearingService<T> extends BaseService<T> {
    ports(portName?: string): Observable<Port> | Observable<Array<Port>> {
        if (portName) {
            return this.http
                .get(PortUrl(this.baseUrl, portName))
                .map(response => response.json() as Port)
                .catch(this.handleError);
        }
        else {
            return this.http
                .get(PortUrl(this.baseUrl))
                .map(response => response.json().ports as Array<Port>)
                .catch(this.handleError);
        }
    }
}