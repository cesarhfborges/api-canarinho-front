import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth-guard';
import { guestGuard } from '@/app/core/guards/guest-guard';
import { AppLayout } from '@/app/shared/layout/component/app.layout';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        // canActivateChild: [authGuard],
        loadChildren: () => import('./app/pages/pages.routes')
    },
    {
        path: '',
        canActivate: [guestGuard],
        // canActivateChild: [guestGuard],
        loadChildren: () => import('./app/auth/auth.routes')
    }
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: '**', redirectTo: '/notfound' }
];
