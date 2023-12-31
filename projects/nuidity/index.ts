import { InjectionToken, Provider } from '@angular/core';

/**
 * Shortcut function to create global providers with autocomplete of the properties
 * @param injectionToken Configuration identifier
 * @param configuration Configuration value
 * @returns Provider to use in N-ui-dity configuration
 */
export function createGlobalConfiguration<T>(
  injectionToken: InjectionToken<T>,
  configuration: T
): Provider {
  return {
    provide: injectionToken,
    useValue: configuration,
  };
}
