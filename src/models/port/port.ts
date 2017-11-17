import { ISerializable } from '../serialization/index';
import * as enums from './enums/index';
import { PortIDL } from './port-idl';

/**
 * Serializable REDHAWK Port Model
 */
export class Port implements ISerializable<Port> {
    /** Port Name */
    public name:      string;
    /** Representation ID  (of the interface) */
    public repId:     string;
    /** Port Direction (Uses/Provides) */
    public direction: enums.PortDirection;
    /** IDL expansion of repID */
    public idl:       PortIDL;

    /** Indicates this is a BULKIO port that supports the websocket interface. */
    public get hasBulkioWebsocket(): boolean {
        return (
            this.direction === enums.PortDirection.Uses &&
            this.idl.namespace === enums.PortIDLNameSpace.BULKIO &&
            this.idl.type !== enums.PortBulkIOIDLType.dataOctet
            );
    }

    /** Indicates this is an FEI port that supports the control interface. */
    public get isFEIControllable(): boolean {
        return (
            this.direction === enums.PortDirection.Provides &&
            this.idl.namespace === enums.PortIDLNameSpace.FRONTEND
            );
    }

    /** Deserializes a JSON object into this class */
    deserialize(input: any) {
        this.name = input.name;
        this.repId = input.repId;
        this.direction = enums.resolvePortDirection(input.direction);
        this.idl = new PortIDL().deserialize(input.idl);
        return this;
    }
}
