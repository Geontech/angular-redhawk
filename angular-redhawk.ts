import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular REDHAWK Component interfaces to services
import { ArRedhawk }            from './redhawk/redhawk.component';
import { RedhawkService }       from './redhawk/redhawk.service';
import { ArDomain }             from './domain/domain.component';
import { ArDeviceManager }      from './devicemanager/devicemanager.component';
import { ArWaveform }           from './waveform/waveform.component';
import { ArDevice }             from './device/device.component';
import { ArComponent }          from './component/component.component';
import { ArPort }               from './port/port.component';

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
