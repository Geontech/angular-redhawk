import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DomainModule } from '../domain/domain.module';
import { DeviceModule } from '../device/device.module';
import { DeviceManagerModule } from '../devicemanager/device-manager.module';
import { ComponentModule } from '../component/component.module';
import { WaveformModule } from '../waveform/waveform.module';
import { RestPythonModule } from '../rest-python/rest-python.module';
import { SocketsModule } from '../sockets/sockets.module';

import { SystemBuilderDirective } from './system-builder.directive';
export { SystemBuilderDirective } from './system-builder.directive';

export { SystemBuilderConfig } from './config/index';
export { provideSystemBuilderConfig } from './provide-system-builder-config';

const REDHAWK_MODULES = [
  DomainModule,
  DeviceModule,
  DeviceManagerModule,
  ComponentModule,
  WaveformModule,
  RestPythonModule,
  SocketsModule
];

/**
 * The SystemBuilder module is designed to bootstrap the dependency injection
 * system of your application to represent unique instances of subsystems in
 * the REDHAWK Domain(s) against which your application is interfacing
 */
@NgModule({
  imports: [
    HttpModule,
    ...REDHAWK_MODULES
  ],
  declarations: [
    SystemBuilderDirective
  ],
  exports: [
    SystemBuilderDirective,
    ...REDHAWK_MODULES
  ]
})
export class SystemBuilderModule {}
