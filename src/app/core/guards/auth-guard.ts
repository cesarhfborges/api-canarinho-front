import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '@/app/core/services/session-service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = async (_route, _state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (sessionService.isAuthenticated()) {
        return true;
    }

    void router.navigate(['/login']);
    return false;
};
