import { Directive, Inject, Injector } from '@angular/core';
import { RedhawkService } from '../redhawk/redhawk.module';
import { DomainService } from '../domain/domain.module';
import { DeviceService } from '../device/device.module';
import { DeviceManagerService } from '../devicemanager/device-manager.module';

import { Redhawk, Domain, DeviceManager } from '../models/index';

import {
  DeviceManagerSubsystem,
  SYSTEM_BUILDER_CONFIG,
  SystemBuilderConfig,
  Subsystem
} from './config/index';

/**
 * Checks the subsystem config to see if the ID and name are considered a match.
 * @param id ID to test against
 * @param name Name to test against
 * @param subsys Subsystem configuration to check
 */
function subsystemMatches(id: string, name: string, subsys: Subsystem): boolean {
  const idTest = new RegExp(subsys.id);
  const nameTest = new RegExp(subsys.name);
  return (idTest.test(id) && nameTest.test(name));
}

@Directive({
  selector: '[arSystemBuilder]',
  exportAs: 'arSystemBuilder'
})
export class SystemBuilderDirective {
  private injector: Injector;
  private config: SystemBuilderConfig;
  private redhawk: RedhawkService;

  constructor(
    injector: Injector,
    redhawk: RedhawkService,
    @Inject(SYSTEM_BUILDER_CONFIG) config: SystemBuilderConfig
  ) {
    this.injector = injector;
    this.redhawk = redhawk;
    this.config = config;

    // Listen for the domain to show up and handle it.
    redhawk.model$.subscribe((rh) => this.checkDomains(rh));
  }

  /**
   * This method handles REDHAWK Model updates which indicate changes in the
   * domain listing.  If the DomainService in the config is already configured,
   * this method exits.  Otherwise, it tries to locate the specified domain
   * and configure the service.
   * 
   * @param rh The REDHAWK model from the update.
   */
  checkDomains(rh: Redhawk) {
    // Get the injected domain service.  If it's not configured, the id will
    // be undefined.
    const domainService = this.injector.get(this.config.domain.token) as DomainService;
    if (domainService.uniqueId !== undefined) {
      return; // Already configured.
    }

    // Iterate over the domain names and pull the models to check the ID and name
    // If a match is found, configure the domainService instance.
    for (const domName of rh.domains) {
      this.redhawk.attach$(domName).subscribe((d) => {
        if (subsystemMatches(d.id, d.name, this.config.domain)) {
          domainService.uniqueId = d.name; // 'name' is not a mistake
          domainService.model$.subscribe((domain) => this.checkDeviceManagers(domain));
        }
      });
    }
  }

  /**
   * This method checks the device manager configurations against the updated
   * domain model and configures the services as needed.
   * @param domain The domain model to check
   */
  checkDeviceManagers(domain: Domain) {
    for (const dmConfig of this.config.domain.deviceManagers) {
      const dmService = this.injector.get(dmConfig.token) as DeviceManagerService;
      if (dmService.uniqueId !== undefined) {
        continue; // Skip, already configured.
      } else {
        // Cross-reference it against domain's listing.
        for (const dmRef of domain.deviceManagers) {
          if (subsystemMatches(dmRef.id, dmRef.name, dmConfig)) {
            dmService.uniqueId = dmRef.id;
            dmService.model$.subscribe((dm) => this.checkDevices(dm, dmConfig));
            break;
          }
        }
      }
    }
  }

  /**
   * This method checks the device configurations in the device manager's config
   * against the devices listing in the device manager model (dm).
   * @param dm The device manager model
   * @param config The device manager configuration related to this model.
   */
  checkDevices(dm: DeviceManager, config: DeviceManagerSubsystem) {
    for (const devConfig of config.devices) {
      const deviceService = this.injector.get(devConfig.token) as DeviceService;
      if (deviceService.uniqueId !== undefined) {
        continue; // Skip, already configured.
      } else {
        // Cross-reference the config against the devices list
        for (const devRef of dm.devices) {
          if (subsystemMatches(devRef.id, devRef.name, devConfig)) {
            deviceService.uniqueId = devRef.id;
          }
        }
      }
    }
  }
}
