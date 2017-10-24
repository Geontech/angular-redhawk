import { DevicePropertyCommandType } from './device-property-command-type';
/**
 * This is the server's response from having issued either a configure, allocate,
 * or deallocate command.  The response indicates the command that was received
 * and whether or not it succeeeded.  For configure, there is no response in the
 * server if the configure fails, so the status is always true unless an 
 * exception is thrown.
 */
export interface IDevicePropertyCommandResponse {
    method: DevicePropertyCommandType;
    status: boolean;
    message: string;
}
