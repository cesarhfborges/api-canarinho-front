import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionService = inject(SessionService);
    const perfilService = inject(PerfilService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            // Verifica se o erro é de falta de autorização (Token expirado ou inválido)
            if (error.status === 401) {
                sessionService.destroySession();
                perfilService.clearPerfil();
                void router.navigate(['/login']);
            }

            // Propaga o erro para ser tratado no componente caso necessário
            return throwError(() => error);
        })
    );
};
