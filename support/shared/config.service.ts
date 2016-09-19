// REST-Python API
import { Injectable } from '@angular/core';

@Injectable()
export class RESTConfig {

    // API location
    private restPath: string = '/redhawk/rest';
    private websocketPath: string = this.websocketUrl() + this.restPath;

    // Internal paths
    private portsPath: string = '/ports';

    // API Public REST
    public redhawkUrl(): string {
        return this.restPath + '/domains';
    }
    public domainsUrl(): string {
        return this.redhawkUrl();
    }
    public domainUrl(domainId: string): string {
        return this.domainsUrl() + '/' + domainId;
    }
    public filesystemUrl(domainId: string, path: string): string {
        return this.domainUrl(domainId) + '/fs/' + path;
    }
    public deviceManagersUrl(domainId: string): string {
        return this.domainUrl(domainId) + '/deviceManagers';
    }
    public deviceManagerUrl(domainId: string, devMgrId: string): string {
        return this.deviceManagersUrl(domainId) + '/' + devMgrId;
    }
    public devicesUrl(domainId: string, devMgrId: string): string {
        return this.deviceManagerUrl(domainId, devMgrId) + '/devices';
    }
    public deviceUrl(domainId: string, devMgrId: string, deviceId: string): string {
        return this.devicesUrl(domainId, devMgrId) + '/' + deviceId;
    }
    public devicePortsUrl(domainId: string, devMgrId: string, deviceId: string): string {
        return this.deviceUrl(domainId, devMgrId, deviceId) + this.portsPath;
    }
    public devicePortUrl(domainId: string, devMgrId: string, deviceId: string, portId: string): string {
        return this.devicePortsUrl(domainId, devMgrId, deviceId) + this.portUrl(portId);
    }
    public waveformsUrl(domainId: string): string {
        return this.domainUrl(domainId) + '/applications';
    }
    public waveformUrl(domainId: string, waveformId: string): string {
        return this.waveformsUrl(domainId) + '/' + waveformId;
    }
    public waveformPortsUrl(domainId: string, waveformId: string): string {
        return this.waveformUrl(domainId, waveformId) + this.portsPath;
    }
    public waveformPortUrl(domainId: string, waveformId: string, portId: string): string {
        return this.waveformPortsUrl(domainId, waveformId) + this.portUrl(portId);
    }
    public componentsUrl(domainId: string, waveformId: string): string {
        return this.waveformUrl(domainId, waveformId) + '/components';
    }
    public componentUrl(domainId: string, waveformId: string, componentId: string): string {
        return this.componentsUrl(domainId, waveformId) + '/' + componentId;
    }
    public componentPortsUrl(domainId: string, waveformId: string, componentId: string): string {
        return this.componentUrl(domainId, waveformId, componentId) + this.portsPath;
    }
    public componentPortUrl(domainId: string, waveformId: string, componentId: string, portId: string): string {
        return this.componentPortsUrl(domainId, waveformId, componentId) + this.portUrl(portId);
    }

    // API Public Websockets
    public websocketUrl(): string { return ((window.location.protocol === 'https:') ? 'wss:' : 'ws:') + '//' + window.location.host; }
    public redhawkSocketUrl(): string { return this.websocketPath + '/redhawk'; }
    public eventSocketUrl(): string { return this.websocketPath + '/events'; }

    private portUrl(portId: string): string { return this.portsPath + '/' + portId; }

}
