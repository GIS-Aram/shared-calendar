import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {provideToastr} from "ngx-toastr";
import {authInterceptor} from "./services/auth.interceptor";

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideAnimationsAsync()]
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideToastr(),
    // provideToastr({
    //   timeOut: 3000,
    //   positionClass: 'toast-top-right', // Standaard positie
    //   preventDuplicates: true,
    // }),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'nl-NL' } // of 'nl-NL' voor Nederlands, 'en-GB' voor Engeland
  ]
};
