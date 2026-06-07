import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const guestGuard: CanActivateFn = (_route, _state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (sessionService.hasActiveSession()) {
        void router.navigate(['/home']);
        return false;
    }

    return true; // Usuário deslogado, acesso liberado à página pública
};
