import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular REDHAWK Component interfaces to services
import { ArRedhawk }       from './components/redhawk.component';
import { ArDomain }        from './components/domain.component';
import { ArDeviceManager } from './components/devicemanager.component';
import { ArWaveform }      from './components/waveform.component';
import { ArDevice }        from './components/device.component';
import { ArComponent }     from './components/component.component';
import { ArPort }          from './components/port.component';

// Models
// import { Redhawk }       from './models/redhawk';
// import { Domain }        from './models/domain';
// import { DeviceManager } from './models/devicemanager';
// import { Waveform }      from './models/waveform';
// import { Device }        from './models/device';
// import { Component }     from './models/component';

// Angular REDHAWK back-end Services
import { RESTConfig }           from './services/config.service';
import { RedhawkService }       from './services/redhawk.service';
import { DomainService }        from './services/domain.service';
import { DeviceManagerService } from './services/devicemanager.service';
import { WaveformService }      from './services/waveform.service';
import { DeviceService }        from './services/device.service';
import { ComponentService }     from './services/component.service';

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
