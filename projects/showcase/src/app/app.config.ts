import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideNuidityConfig } from '../nuidity/nuidity.config.module';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideNuidityConfig()],
};
