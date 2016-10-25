import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular REDHAWK Directive interfaces to services
import { ArRedhawkDirective }            from './redhawk/redhawk.directive';
import { ArDomainDirective }             from './domain/domain.directive';
import { ArDeviceManagerDirective }      from './devicemanager/devicemanager.directive';
import { ArWaveformDirective }           from './waveform/waveform.directive';
import { ArDeviceDirective }             from './device/device.directive';
import { ArComponentDirective }          from './component/component.directive';
import { ArPortDirective }               from './port/port.directive';

// Pipes
import { ArPropertyPipe, ArPropertiesPipe } from './property/property.pipe';

// Useful services
export { RedhawkService }       from './redhawk/redhawk.service';
export { DomainService }        from './domain/domain.service';
export { FilesystemService }    from './filesystem/filesystem.service';
export { DeviceManagerService } from './devicemanager/devicemanager.service';
export { WaveformService }      from './waveform/waveform.service';
export { DeviceService }        from './device/device.service';
export { ComponentService }     from './component/component.service';
export { PortService }          from './port/port.service';

// Top Service
import { RedhawkService } from './redhawk/redhawk.service';

// Models
export * from './redhawk/redhawk';
export * from './domain/domain';
export * from './filesystem/filesystem';
export * from './devicemanager/devicemanager';
export * from './waveform/waveform';
export * from './device/device';
export * from './component/component';
export * from './port/port';
export * from './property/property';

@NgModule({
    imports:      [
        CommonModule
    ],
    exports:      [
        // High-level interfaces
        ArRedhawkDirective,
        ArDomainDirective,
        ArDeviceManagerDirective,
        ArDeviceDirective,
        ArWaveformDirective,
        ArComponentDirective,
        ArPortDirective,
        // Pipes
        ArPropertyPipe,
        ArPropertiesPipe
    ],
    declarations: [
        // High-level interfaces
        ArRedhawkDirective,
        ArDomainDirective,
        ArDeviceManagerDirective,
        ArDeviceDirective,
        ArWaveformDirective,
        ArComponentDirective,
        ArPortDirective,
        // Pipes
        ArPropertyPipe,
        ArPropertiesPipe
    ],
    providers:    [
        // This is the only global service
        RedhawkService
    ]
})
export class AngularRedhawkModule { }
