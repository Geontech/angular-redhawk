import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../shared/serializable';
import { OdmEvent } from './odm.event.base';

export enum ResourceStateChange {
    STOPPED,
    STARTED,
    UNKNOWN
}

export function resolve(state: string): ResourceStateChange {
    switch (state) {
        case 'STOPPED':
            return ResourceStateChange.STOPPED;
        case 'STARTED':
            return ResourceStateChange.STARTED;
        default:
            return ResourceStateChange.UNKNOWN;
    }
}

export class ResourceStateChangeEvent
    extends OdmEvent
    implements ISerializable<ResourceStateChangeEvent> {

    public stateChangeFrom: ResourceStateChange;
    public stateChangeTo:   ResourceStateChange;

    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = resolve(input.stateChangeFrom.value);
        this.stateChangeTo = resolve(input.stateChangeTo.value);
        return this;
    }
}

export function isResourceStateChangeEvent(ev: OdmEvent): ev is ResourceStateChangeEvent {
    return ev instanceof ResourceStateChangeEvent;
}

@Pipe({ name: 'resourceStateChange' })
export class ResourceStateChangePipe implements PipeTransform {
    transform (change: ResourceStateChange): string {
        return ResourceStateChange[change];
    }
}
