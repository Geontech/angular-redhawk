import { Pipe, PipeTransform } from '@angular/core';

import { ISerializable } from '../../base/serializable';
import { OdmEvent } from './odm.event.base';

export enum ResourceStateChange {
    STOPPED,
    STARTED,
    UNKNOWN
}

function fromString(state: string): ResourceStateChange {
    let out = ResourceStateChange.UNKNOWN;
    switch (state) {
        case 'STOPPED':
            out = ResourceStateChange.STOPPED;
            break;
        case 'STARTED':
            out = ResourceStateChange.STARTED;
            break;
        default:
            // Do anything?
            break;
    }
    return out;
}

export class ResourceStateChangeEvent
    extends OdmEvent
    implements ISerializable<ResourceStateChangeEvent> {

    public stateChangeFrom: ResourceStateChange;
    public stateChangeTo:   ResourceStateChange;

    deserialize(input: any) {
        super.deserialize(input);
        this.stateChangeFrom = fromString(input.stateChangeFrom.value);
        this.stateChangeTo = fromString(input.stateChangeTo.value);
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
