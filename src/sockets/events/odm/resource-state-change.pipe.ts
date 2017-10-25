import { Pipe, PipeTransform } from '@angular/core';

import { ResourceStateChange } from '../../../models/index';

/**
 * Acts like 'toString' for the ResourceStateChange enumeration
 */
@Pipe({ name: 'resourceStateChange' })
export class ResourceStateChangePipe implements PipeTransform {
    transform (change: ResourceStateChange): string {
        return ResourceStateChange[change];
    }
}
