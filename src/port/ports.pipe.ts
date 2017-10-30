import { Pipe, PipeTransform } from '@angular/core';

import { Ports } from '../models/index';

/**
 * Returns a sub-list of ports from a list of properties using an array of names
 * or a single name.  In either case, the entries can be regular expressions.
 * An optional third argument is provided, 'bulkio', which will further filter
 * the list to only those that support BULKIO web sockets.
 */
@Pipe({name: 'arPorts'})
export class PortsPipe implements PipeTransform {
    transform(ports: Ports, names: string | Array<string>, bulkio?: boolean): Ports {
        let set: Ports = [];
        if (!(names instanceof Array)) {
            names = [names];
        }
        ports.filter(port => {
            for (let name of names) {
                let tester = new RegExp(name);
                if (tester.test(port.name)) {
                    if (bulkio === undefined) {
                        set.push(port);
                    } else if (bulkio === true && port.hasBulkioWebsocket) {
                        set.push(port);
                    }
                }
            }
        });
        return set;
    }
}
