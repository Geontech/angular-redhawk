import { ResourceRefs } from '../models/index';

/**
 * Launch Command response indicates the success or failure of an attempt to
 * launch a waveform.  The returned applications list is the up-to-date list of
 * running applications in the domain and launched is the newly launched 
 * instances's ID.
 */
export interface IWaveformLaunchCommandResponse {
    launched: string;
    applications: ResourceRefs;
}
