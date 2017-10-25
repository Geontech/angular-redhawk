import { ISerializable } from '../serialization/index';
import * as enums from './enums/index';
import { PortIDL } from './port-idl';

/**
 * Serializable REDHAWK Port Model
 */
export class Port implements ISerializable<Port> {
    public name:      string;
    public repId:     string;
    public direction: enums.PortDirection;
    public idl:       PortIDL;

    /** @property {boolean} Indicates this is a BULKIO port that supports the websocket interface. */
    public get hasBulkioWebsocket(): boolean {
        return (
            this.direction === enums.PortDirection.Uses &&
            this.idl.namespace === enums.PortIDLNameSpace.BULKIO
            );
    }

    /** @property {boolean} Indicates this is an FEI port that supports the control interface. */
    public get isFEIControllable(): boolean {
        return (
            this.direction === enums.PortDirection.Provides &&
            this.idl.namespace === enums.PortIDLNameSpace.FRONTEND
            );
    }

    deserialize(input: any) {
        this.name = input.name;
        this.repId = input.repId;
        this.direction = enums.resolvePortDirection(input.direction);
        this.idl = new PortIDL().deserialize(input.idl);
        return this;
    }
}
