import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>Angular 2 test</h1>
    <ar-redhawk #redhawk>

      <div>Domains List:</div>
      <ar-domain #domain *ngFor="let domainId of redhawk.model.domains;" [domainId]="domainId">
        <div>{{ domain.model.name }}</div>

        <div>Device Managers:</div>
        <ar-device-manager #dm *ngFor="let manager of domain.model.deviceManagers" [deviceManagerId]="manager.id">
          <div>{{ dm.model.name }}</div>

          <div>Devices:</div>
          <ar-device #device *ngFor="let dev of dm.model.devices" [deviceId]="dev.id">
            <div>{{ device.model.name }}'s Ports</div>
            <div>Ports:</div>
            <ar-port #port *ngFor="let p of device.model.ports" [portId]="p.name">
              <div>{{ port.model.name }}</div>
              <div *ngIf="port.model.idl">Type: {{ port.model.idl.type }}</div>
            </ar-port>
          </ar-device>
        </ar-device-manager>

        <div>Applications:</div>
        <ar-waveform #waveform *ngFor="let wave of domain.model.applications" [waveformId]="wave.id">
          <div>{{ waveform.model.name }}</div>
          <div>Ports:</div>
          <ar-port #port *ngFor="let p of waveform.model.ports" [portId]="p.name">
            <div>{{ port.model.name }}</div>
            <div *ngIf="port.model.idl">Type: {{ port.model.idl.type }}</div>
          </ar-port>

          <div>Components:</div>
          <ar-component #component *ngFor="let comp of waveform.model.comps" [componentId]="comp.id">
            <div>{{ component.model.name }}'s Ports</div>
            <div>Ports:</div>
            <ar-port #port *ngFor="let p of component.model.ports" [portId]="p.name">
              <div>{{ port.model.name }}</div>
              <div *ngIf="port.model.idl">Type: {{ port.model.idl.type }}</div>
            </ar-port>
          </ar-component>
        </ar-waveform>

      </ar-domain>
    </ar-redhawk>
    `
})
export class AppComponent {
}
