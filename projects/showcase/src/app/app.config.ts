import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideNuidityConfig } from '../nuidity-structure/nuidity.config.module';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideNuidityConfig()],
};
