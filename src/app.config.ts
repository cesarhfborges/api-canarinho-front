import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { headersInterceptor } from '@/app/core/interceptors/headers-interceptor';
import { errorInterceptor } from '@/app/core/interceptors/error-interceptor';
import { initializeAppFactory } from '@/app/core/utils/initialize-app-factory';
import { providePrimeNG } from 'primeng/config';
import localePt from '@angular/common/locales/pt';
import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SessionService } from '@/app/core/services/session-service';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
    providers: [
        DialogService,
        MessageService,
        ConfirmationService,
        SessionService,
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: { dateFormat: 'dd/MM/yyyy HH:mm:ss' },
        },
        provideAppInitializer(initializeAppFactory),
        provideHttpClient(withFetch(), withInterceptors([headersInterceptor, errorInterceptor])),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withComponentInputBinding(),
            // withEnabledBlockingInitialNavigation()
        ),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideHighlightOptions({
            fullLibraryLoader: () => import('highlight.js'),
            lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
            lineNumbersOptions: {
                singleLine: false,
                startFrom: 0
            },
            highlightOptions: {}
        })
    ]
};
