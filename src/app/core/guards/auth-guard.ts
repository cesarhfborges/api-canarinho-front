import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';

export const authGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (sessionService.hasActiveSession()) {
        return true;
    }

    void router.navigate(['/login']);
    return false;
};
