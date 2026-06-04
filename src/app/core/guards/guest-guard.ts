import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';

export const guestGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (sessionService.hasActiveSession()) {
        void router.navigate(['/home']);
        return false;
    }

    return true; // Usuário deslogado, acesso liberado à página pública
};
