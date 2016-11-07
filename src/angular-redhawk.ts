import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { RedhawkModule }       from './redhawk/redhawk.module';
export * from './redhawk/redhawk.module';
import { DomainModule }        from './domain/domain.module';
export * from './domain/domain.module';
import { FilesystemModule }    from './filesystem/filesystem.module';
export * from './filesystem/filesystem.module';
import { DeviceManagerModule } from './devicemanager/devicemanager.module';
export * from './devicemanager/devicemanager.module';
import { WaveformModule }      from './waveform/waveform.module';
export * from './waveform/waveform.module';
import { DeviceModule }        from './device/device.module';
export * from './device/device.module';
import { ComponentModule }     from './component/component.module';
export * from './component/component.module';
import { PortModule }          from './port/port.module';
export * from './port/port.module';

// Top Service
import { RedhawkService } from './redhawk/redhawk.service';

// Pipes
import { ArPropertyPipe, ArPropertiesPipe } from './property/property.pipe';

@NgModule({
    imports:      [
        CommonModule,
        RedhawkModule,
        // Submodules
        DomainModule,
        FilesystemModule,
        WaveformModule,
        DeviceManagerModule,
        DeviceModule,
        ComponentModule,
        PortModule
    ],
    exports:      [
        // Submodules
        RedhawkModule,
        DomainModule,
        FilesystemModule,
        WaveformModule,
        DeviceManagerModule,
        DeviceModule,
        ComponentModule,
        PortModule,
        // Pipes
        ArPropertyPipe,
        ArPropertiesPipe
    ],
    declarations: [
        // Pipes
        ArPropertyPipe,
        ArPropertiesPipe
    ],
    providers:    [ ]
})
export class AngularRedhawkModule { }
