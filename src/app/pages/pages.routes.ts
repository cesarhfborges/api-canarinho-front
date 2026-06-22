import { Routes } from '@angular/router';
import { Dashboard } from '@/app/pages/dashboard/dashboard';

const pageRoutes: Routes = [
    { path: 'home', component: Dashboard },
    {
        path: 'projetos',
        loadChildren: () => import('./projetos/projetos.routes')
    },
    {
        path: 'perfil',
        loadChildren: () => import('./perfil/perfil.routes')
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routes')
    }
];

export default pageRoutes;
