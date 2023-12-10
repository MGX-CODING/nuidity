import {
  EnvironmentProviders,
  NgModule,
  Provider,
  makeEnvironmentProviders,
} from '@angular/core';

/**
 * This file serves as the configuration file for the n-ui-dity library.
 * You can provide default configurations for all of the configurable features.
 * Refer to the documentation, or use intellisense, to know how to fill your configurations. 
 */

// Put all of your configurations into this array
const providers: (Provider | EnvironmentProviders)[] = [];

// If you do not use a standalone application, import this module into your application module
@NgModule({ providers })
export class NuiConfigModule {}

// If you use a standalone application, call this function inside your app configuration file
export function provideNuidityConfig(): EnvironmentProviders {
  return makeEnvironmentProviders(providers);
}
