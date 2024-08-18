import {ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {provideToastr} from "ngx-toastr";
import {authInterceptor} from "./services/auth.interceptor";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { provideServiceWorker } from '@angular/service-worker';
import {registerLocaleData} from "@angular/common";
import localeNl from '@angular/common/locales/nl';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideAnimationsAsync()]
// };
// datums en tijden volgens de Nederlandse notatie weergeven
registerLocaleData(localeNl, 'nl-NL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr(),
    // provideToastr({
    //   timeOut: 3000,
    //   positionClass: 'toast-top-right', // Standaard positie
    //   preventDuplicates: true,
    // }),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'nl-NL' }, // of 'nl-NL' voor Nederlands, 'en-GB' voor Engeland
    { provide: LOCALE_ID, useValue: 'nl-NL' }, // datums en tijden volgens de Nederlandse notatie weergeven
    // Voeg de TranslateModule toe via importProvidersFrom
    importProvidersFrom(TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};


// Factory voor het laden van vertalingen
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


