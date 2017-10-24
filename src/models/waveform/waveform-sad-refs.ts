import { WaveformSAD } from './waveform-sad';

/**
 * List of available Waveform SAD (references)
 */
export type WaveformSADRefs = Array<WaveformSAD>;

/**
 * Helper function to convert a JSON object into a list of Waveform SAD refs
 */
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
