import { Directive, Inject, Injector } from '@angular/core';
import { RedhawkService } from '../redhawk/redhawk.module';
import { DomainService } from '../domain/domain.module';
import { DeviceService } from '../device/device.module';
import { DeviceManagerService } from '../devicemanager/device-manager.module';
import { WaveformService } from '../waveform/waveform.module';
import { ComponentService } from '../component/component.module';

import { Redhawk, Domain, DeviceManager, Waveform } from '../models/index';

import {
  DeviceManagerSubsystem,
  SYSTEM_BUILDER_CONFIG,
  SystemBuilderConfig,
  Subsystem
} from './config/index';
import { WaveformSubsystem } from './config/waveform-subsystem';

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

/**
 * This Directive must be instantiated once in your application where the 'provideSystemBuilderConfig' was
 * added to the providers.  This directive serves two purposes.  First, it is a nice visual queue in your 
 * template that you're using the SystemBuilder.  Second, it acts as a background service for updating
 * your services.  If you need to know whether your service is up or down, observe the 'configured$'
 * member.
 */
@Directive({
  selector: '[arSystemBuilder]',
  exportAs: 'arSystemBuilder'
})
export class SystemBuilderDirective {
  /** The Injector for fetching services */
  private injector: Injector;
  /** The SystemBuilder configuration being managed */
  private config: SystemBuilderConfig;
  /** The REDHAWK service used for model look-ups */
  private redhawk: RedhawkService;

  /**
   * Constructor
   * @param injector The parent injector for finding the pre-loaded services
   * @param redhawk The REDHAWK Service for locating the entities related to the services
   * @param config The user's SystemBuilder configuration for this directive to manage
   */
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
          domainService.model$.subscribe((domain) => {
            this.checkDeviceManagers(domain);
            this.checkWaveforms(domain);
          });
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
    if (this.config.domain.deviceManagers) {
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
  }

  /**
   * This method checks the device configurations in the device manager's config
   * against the devices listing in the device manager model (dm).
   * @param dm The device manager model
   * @param config The device manager configuration related to this model.
   */
  checkDevices(dm: DeviceManager, config: DeviceManagerSubsystem) {
    if (config.devices) {
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

  /**
   * This method checks the waveform configurations against the updated
   * domain model and configures the services as needed.
   * @param domain The domain model to check
   */
  checkWaveforms(domain: Domain) {
    if (this.config.domain.waveforms) {
      for (const waveConfig of this.config.domain.waveforms) {
        const waveService = this.injector.get(waveConfig.token) as WaveformService;
        if (waveService.uniqueId !== undefined) {
          continue; // Skip, already configured.
        } else {
          // Cross-reference it against the domain's listing.
          for (const waveRef of domain.applications) {
            if (subsystemMatches(waveRef.id, waveRef.name, waveConfig)) {
              waveService.uniqueId = waveRef.id;
              waveService.model$.subscribe((wave) => this.checkComponents(wave, waveConfig));
            }
          }
        }
      }
    }
  }

  /**
   * This method checks the component configurations in the waveform's config
   * against the components listing in the waveform model (wave).
   * @param wave The waveform model
   * @param config The waveform configuration related to the model
   */
  checkComponents(wave: Waveform, config: WaveformSubsystem) {
    if (config.components) {
      for (const compConfig of config.components) {
        const compService = this.injector.get(compConfig.token as ComponentService);
        if (compService.uniqueId !== undefined) {
          continue; // Skip, already configured.
        } else {
          // Cross-reference the config against the components list
          for (const compRef of wave.components) {
            if (subsystemMatches(compRef.id, compRef.name, compConfig)) {
              compService.uniqueId = compRef.id;
            }
          }
        }
      }
    }
  }
}
