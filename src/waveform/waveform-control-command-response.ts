/**
 * The Waveform Control Command Response indicates whether the command to start
 * or stop was successful.  In the case of launching, the response indicates if
 * the waveform is started.
 */
export interface IWaveformControlCommandResponse {
    /** Waveform's ID */
    id: string;
    /** true if the Waveform is started, false otherwise */
    started: boolean;
}
