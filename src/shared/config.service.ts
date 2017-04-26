// REST API URL Helper functions
// The general concept here is to build out a url you need to already know something
// about the hierarchy of REDHAWK systems.  To get a Domain, for example:
//
//     DomainUrl(RedhawkUrl(), 'MyDomain') ==> /redhawk/rest/MyDomain
//
// Or a device listing on a device manager:
//
//     DeviceUrl(DeviceManagerUrl(DomainUrl(RedhawkUrl(), 'MyDomain'), 'NodeId'))
//         ==> /redhawk/rest/MyDomain/deviceManagers/NodeId/devices
//
// Ideally, you won't need this outside of the service layer, which provide "baseUrl"
// for their services.  So from a Device service appropriately preceded by a Device Manager
// service, the above example becomes this:
//
//      DeviceUrl(this.dmService.baseUrl) ==> (Same output)
//
// All of these functions have similar setups except the root, RedhawkUrl.  Include
// the baseUrl field and, optionally, the specific entity ID.
const REST_URL = '/redhawk/rest';

// Entities
export function RedhawkUrl(): string { return REST_URL; }
export function EventChannelsUrl(): string { return BaseUrl(REST_URL, '/events/'); }
export function DomainUrl(baseUrl: string, domainId?: string): string { return BaseUrl(baseUrl, '/domains', domainId); }
export function FileSystemUrl(baseUrl: string, path?: string): string { return BaseUrl(baseUrl, '/fs', path); }
export function DeviceManagerUrl(baseUrl: string, deviceManagerId?: string): string {
    return BaseUrl(baseUrl, '/deviceManagers', deviceManagerId);
}
export function DeviceUrl(baseUrl: string, deviceId?: string): string { return BaseUrl(baseUrl, '/devices', deviceId); }
export function ServiceUrl(baseUrl: string, serviceId?: string): string { return BaseUrl(baseUrl, '/services', serviceId); }
export function WaveformUrl(baseUrl: string, waveformId?: string): string { return BaseUrl(baseUrl, '/applications', waveformId); }
export function ComponentUrl(baseUrl: string, componentId?: string): string { return BaseUrl(baseUrl, '/components', componentId); }

// Entity Fields
export function PropertyUrl(baseUrl: string): string { return BaseUrl(baseUrl, '/properties'); }
export function PortUrl(baseUrl: string, portId?: string): string { return BaseUrl(baseUrl, '/ports', portId); }

// Entity Sockets
export function BulkioSocketUrl(portUrl: string): string { return WebsocketUrl() + BaseUrl(portUrl, '/bulkio'); }
export function RedhawkSocketUrl(): string { return WebsocketUrl() + '/redhawk'; }
export function EventSocketUrl(): string { return WebsocketUrl() + '/events'; }




// Base URL for websockets
function WebsocketUrl(): string {
    return ((window.location.protocol === 'https:') ? 'wss:' : 'ws:')
        + '//' + window.location.host + REST_URL; }

// Base Url builder function
function BaseUrl(baseUrl: string, subPath?: string, target?: string): string {
    if (subPath) {
        if (target) {
            return baseUrl + subPath + '/' + target;
        }
        return baseUrl + subPath;
    }
    return baseUrl;
}
