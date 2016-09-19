import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular REDHAWK REST paths
import { RESTConfig } from './shared/config.service';

// Angular REDHAWK Component interfaces to services
import { ArRedhawk }            from './redhawk/redhawk.component';
import { RedhawkService }       from './redhawk/redhawk.service';
// import { Redhawk }           from './redhawk/redhawk';
import { ArDomain }             from './domain/domain.component';
import { DomainService }        from './domain/domain.service';
// import { Domain }            from './domain/domain';
// import { ArDomain }             from './filesystem/filesystem.component';
import { FilesystemService }        from './filesystem/filesystem.service';
// import { Filesystem }            from './filesystem/filesystem';
import { ArDeviceManager }      from './devicemanager/devicemanager.component';
import { DeviceManagerService } from './devicemanager/devicemanager.service';
// import { DeviceManager }     from './devicemanager/devicemanager';
import { ArWaveform }           from './waveform/waveform.component';
import { WaveformService }      from './waveform/waveform.service';
// import { Waveform }          from './waveform/waveform';
import { ArDevice }             from './device/device.component';
import { DeviceService }        from './device/device.service';
// import { Device }            from './device/device';
import { ArComponent }          from './component/component.component';
import { ComponentService }     from './component/component.service';
// import { Component }         from './component/component';
import { ArPort }               from './port/port.component';


// Angular REDHAWK back-end Services

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
        ArPort,
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
        RESTConfig,
        RedhawkService,
        DomainService,
        DeviceManagerService,
        DeviceService,
        WaveformService,
        ComponentService
    ]
})
export class ArSupportModule { }
