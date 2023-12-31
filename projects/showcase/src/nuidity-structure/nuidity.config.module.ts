import {
  EnvironmentProviders,
  NgModule,
  Provider,
  makeEnvironmentProviders,
} from '@angular/core';

const providers: Provider[] = [];

@NgModule({ providers })
export class NuidityConfigModule {}

export function provideNuidityConfig(): EnvironmentProviders {
  return makeEnvironmentProviders(providers);
}
