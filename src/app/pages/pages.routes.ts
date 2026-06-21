import { Routes } from '@angular/router';
import { Dashboard } from '@/app/pages/dashboard/dashboard';

const pageRoutes: Routes = [
    { path: 'home', component: Dashboard },
    {
        path: 'projetos',
        loadChildren: () => import('./projetos/projetos.routes')
    }
];

export default pageRoutes;
