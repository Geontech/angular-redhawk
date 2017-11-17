/** Command Type for connecting and disconnecting to event channels */
export type CommandType = 'ADD' | 'REMOVE';

/**
 * The command interface for adding or removing event channels to the socket.
 */
export interface IEventChannelCommand {
    /** ADD or REMOVE access to a channel */
    command: CommandType;
    /** The Domain ID (Name) */
    domainId: string;
    /** The name of the channel */
    topic: string;
}
