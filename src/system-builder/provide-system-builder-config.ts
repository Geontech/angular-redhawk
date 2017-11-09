import { Provider } from '@angular/core';

import { SYSTEM_BUILDER_CONFIG, SystemBuilderConfig } from './config/index';
import {
  deviceManagerProvider,
  deviceProvider,
  domainProvider
} from './providers/index';

/**
 * Within the component or module where you will use the arSystemBuilder
 * directive, use this function to build the set of providers for your
 * subsystems.
 *
 * @param config The SystemBuilder configuration for your application.
 */
export function provideSystemBuilderConfig(config: SystemBuilderConfig): Provider[] {
  const providers: Provider[] = [
    // Provide the config to the directive
    { provide: SYSTEM_BUILDER_CONFIG, useValue: config }
  ];

  // Provide the domain
  config.domain.id = config.domain.id || '.*';
  config.domain.name = config.domain.name || '.*';
  providers.push(domainProvider(config.domain.token));

  // Loop over the configuration and add the providers referencing one another.
  for (const node of config.domain.deviceManagers) {
    node.id = node.id || '.*';
    node.name = node.name || '.*';
    providers.push(deviceManagerProvider(node.token, config.domain.token));
    for (const device of node.devices) {
      device.id = device.id || '.*';
      device.name = device.name || '.*';
      providers.push(deviceProvider(device.token, node.token));
    }
  }

  return providers;
}
