import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './auth/custom.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideToastr({
    timeOut: 2000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    maxOpened: 2
  }), provideHttpClient(withFetch()), provideClientHydration(), provideHttpClient(withInterceptors([customInterceptor])), provideAnimationsAsync('noop')]
};