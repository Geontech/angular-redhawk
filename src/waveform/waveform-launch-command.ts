/**
 * Waveform Launch Command is used to launch (and optionally start) waveforms.
 */
export interface IWaveformLaunchCommand {
    /** The name of the Waveform to launch (SAD definition name) */
    name: string;
    /** Set to true if the Waveform should be started too, false otherwise */
    started: boolean;
}

