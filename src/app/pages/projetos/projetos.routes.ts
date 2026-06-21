import { Routes } from '@angular/router';
import { ProjetosListar } from '@/app/pages/projetos/projetos-listar/projetos-listar';
import { ProjetosEditar } from '@/app/pages/projetos/projetos-editar/projetos-editar';

const projetosRoutes: Routes = [
    { path: '', component: ProjetosListar },
    {
        path: ':id',
        component: ProjetosEditar
    }
];

export default projetosRoutes;
