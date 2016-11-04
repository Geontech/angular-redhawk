import { ISerializable } from '../shared/serializable';

export enum SourceCategory {
    DEVICE_MANAGER,
    DEVICE,
    APPLICATION_FACTORY,
    APPLICATION,
    SERVICE
}

export type TSourceCategory =
    'DEVICE_MANAGER' |
    'DEVICE' |
    'APPLICATION_FACTORY' |
    'APPLICATION' |
    'SERVICE';

export class OdmEvent implements ISerializable<OdmEvent> {

    producerId: string;
    sourceId: string;
    sourceName: string;
    sourceCategory: SourceCategory;
    sourceIOR: string;

    static resolveSourceCategory(category: TSourceCategory): SourceCategory {
        switch (<TSourceCategory> category) {
            case 'DEVICE_MANAGER':
                return SourceCategory.DEVICE_MANAGER;
            case 'DEVICE':
                return SourceCategory.DEVICE;
            case 'APPLICATION_FACTORY':
                return SourceCategory.APPLICATION_FACTORY;
            case 'APPLICATION':
                return SourceCategory.APPLICATION;
            case 'SERVICE':
            // tslint:disable-next-line:no-switch-case-fall-through
            default:
                return SourceCategory.SERVICE;
        }
    }

    deserialize(input: any) {
        this.producerId = input.producerId;
        this.sourceId = input.sourceId;
        this.sourceName = input.sourceName;
        this.sourceIOR = input.sourceIOR;
        this.sourceCategory = OdmEvent.resolveSourceCategory(input.sourceCategory);
        return this;
    }
}
