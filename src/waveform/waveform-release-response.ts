import { ResourceRefs } from '../models/index';

/**
 * Waveform release response contains the ID of the recently released waveform
 * and the up-to-date list of any running applications.
 */
export interface IWaveformReleaseResponse {
    released: string;
    applications: ResourceRefs;
}
