import {
    Resource,
    ResourceRefs,
    deserializeResourceRefs
} from '../shared/resource';

import { ISerializable } from '../shared/serializable';

// Waveform model
export class Waveform extends Resource implements ISerializable<Waveform> {
    public components: ResourceRefs;

    constructor() {
        super();
        this.components = [];
    }

    deserialize(input: any) {
        super.deserialize(input);
        this.components = deserializeResourceRefs(input.components);
        return this;
    }
}

// Waveform SAD model
export class WaveformSAD implements ISerializable<WaveformSAD> {
    public name: string;
    public sad: string;

    deserialize(input: any) {
        this.name = input.name;
        this.sad = input.sad;
        return this;
    }
}
export type WaveformSADRefs = Array<WaveformSAD>;

export function deserializeWaveformSADRefs (inputs?: any): WaveformSADRefs {
    if (!inputs) {
        return [];
    }
    let refs: WaveformSADRefs = [];
    for (let ref of inputs) {
        refs.push(new WaveformSAD().deserialize(ref));
    }
    return refs;
}

// Waveform Launch Command and Response
export interface IWaveformLaunchCommand {
    name: string;
    started: boolean;
}
export interface IWaveformLaunchCommandResponse {
    launched: string;
    applications: ResourceRefs;
}

// Waveform release response
export interface IWaveformReleaseResponse {
    released: string;
    applications: ResourceRefs;
}

// Waveform Control and  Response
export class IWaveformControlCommand {
    started: boolean;
}
export interface IWaveformControlCommandResponse {
    id: string;
    started: boolean;
}
