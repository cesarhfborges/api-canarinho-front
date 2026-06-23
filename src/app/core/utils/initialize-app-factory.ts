import { inject } from '@angular/core';
import { finalize, firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { ConfigService } from '@/app/core/services/config-service';

export async function initializeAppFactory(): Promise<any> {
    const sessionService = inject(SessionService);
    const perfilService = inject(PerfilService);
    const configService = inject(ConfigService);

    try {
        await firstValueFrom(configService.loadConfig());
    } catch (error) {
        console.error('Failed to load system config', error);
    }

    await firstValueFrom(
        perfilService.getPerfil().pipe(
            tap(() => {
                sessionService.createSession();
            }),
            catchError(() => {
                sessionService.destroySession();
                return of(null);
            }),
            finalize(() => {
                // sessionService.markLoaded();
            })
        )
    );

    return Promise.resolve();
}
