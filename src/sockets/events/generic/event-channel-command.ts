export type CommandType = 'ADD' | 'REMOVE';

/**
 * The command interface for adding or removing event channels to the socket.
 */
export interface IEventChannelCommand {
    command: CommandType;
    domainId: string;
    topic: string;
}
