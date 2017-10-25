import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { RedhawkModule }       from './redhawk/redhawk.module';
export * from './redhawk/redhawk.module';
import { DomainModule }        from './domain/domain.module';
export * from './domain/domain.module';
import { FileSystemModule }    from './filesystem/file-system.module';
export * from './filesystem/file-system.module';
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
import { SocketsModule }       from './sockets/sockets.module';
export * from './sockets/sockets.module';
import { PropertyModule }      from './property/property.module';
export * from './property/property.module';
import { RestPythonModule } from './rest-python/rest-python.module';
export * from './rest-python/rest-python.module';

// Models
export * from './models/index';

// Must export this base class module...
export * from './base/index';

// These have exports
const REDHAWK_MODULES = [
    RedhawkModule,
    // Submodules
    DomainModule,
    FileSystemModule,
    WaveformModule,
    DeviceManagerModule,
    DeviceModule,
    ComponentModule,
    PortModule,
    PropertyModule,
    SocketsModule
];

@NgModule({
    imports: [
        CommonModule,
        RestPythonModule,
        ...REDHAWK_MODULES
    ],
    exports: [
        CommonModule,
        ...REDHAWK_MODULES
    ]
})
export class AngularRedhawkModule {}
