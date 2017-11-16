import { ResourceRefs } from '../models/index';

/**
 * Waveform release response contains the ID of the recently released waveform
 * and the up-to-date list of any running applications.
 */
export interface IWaveformReleaseResponse {
    /** The ID of the released (removed) Waveform */
    released: string;
    /** The list of currently running Waveforms that remain */
    applications: ResourceRefs;
}
