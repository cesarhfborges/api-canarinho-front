import { inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService } from '@/app/core/services/perfil-service';

export function initializeAppFactory(): Promise<any> {
    const sessionService = inject(SessionService);
    const perfilService = inject(PerfilService);

    if (sessionService.hasActiveSession()) {
        return firstValueFrom(
            perfilService.getPerfil().pipe(
                catchError((error) => {
                    console.error('Erro crítico na inicialização do perfil:', error);
                    sessionService.destroySession();
                    return of(null);
                })
            )
        );
    }

    return Promise.resolve();
}
