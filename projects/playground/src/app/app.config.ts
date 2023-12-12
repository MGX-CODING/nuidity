import { ApplicationConfig } from '@angular/core';
import { provideNuidityConfig } from '../theming/nuidity.config.module';

export const appConfig: ApplicationConfig = {
  providers: [provideNuidityConfig()]
};
