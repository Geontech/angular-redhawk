export type CommandType = 'ADD' | 'REMOVE';

export interface IEventChannelCommand {
    command: CommandType;
    domainId: string;
    topic: string;
}
