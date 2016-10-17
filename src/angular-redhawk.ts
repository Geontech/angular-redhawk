import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular REDHAWK Component interfaces to services
import { ArRedhawk }            from './redhawk/redhawk.directive';
import { RedhawkService }       from './redhawk/redhawk.service';
import { ArDomain }             from './domain/domain.directive';
import { ArDeviceManager }      from './devicemanager/devicemanager.directive';
import { ArWaveform }           from './waveform/waveform.directive';
import { ArDevice }             from './device/device.directive';
import { ArComponent }          from './component/component.directive';
import { ArPort }               from './port/port.directive';

// Useful services
export { RedhawkService }       from './redhawk/redhawk.service';
export { DomainService }        from './domain/domain.service';
export { FilesystemService }    from './filesystem/filesystem.service';
export { DeviceManagerService } from './devicemanager/devicemanager.service';
export { WaveformService }      from './waveform/waveform.service';
export { DeviceService }        from './device/device.service';
export { ComponentService }     from './component/component.service';
export { PortService }          from './port/port.service';

// Models
export * from './redhawk/redhawk';
export * from './domain/domain';
export * from './filesystem/filesystem';
export * from './devicemanager/devicemanager';
export * from './waveform/waveform';
export * from './device/device';
export * from './component/component';
export * from './port/port';
export * from './shared/property';

@NgModule({
    imports:      [
        CommonModule
    ],
    exports:      [
        // High-level interfaces
        ArRedhawk,
        ArDomain,
        ArDeviceManager,
        ArDevice,
        ArWaveform,
        ArComponent,
        ArPort
    ],
    declarations: [
        // High-level interfaces
        ArRedhawk,
        ArDomain,
        ArDeviceManager,
        ArDevice,
        ArWaveform,
        ArComponent,
        ArPort
    ],
    providers:    [
        // This is the only global service
        RedhawkService
    ]
})
export class AngularRedhawkModule { }
