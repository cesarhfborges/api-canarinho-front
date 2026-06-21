import { inject } from '@angular/core';
import { finalize, firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService } from '@/app/core/services/perfil-service';

export async function initializeAppFactory(): Promise<any> {
    const sessionService = inject(SessionService);
    const perfilService = inject(PerfilService);

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
