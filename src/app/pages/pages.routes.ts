import { Routes } from '@angular/router';
import { ReuniaoListar } from '@/app/pages/reuniao/reuniao-listar/reuniao-listar';
import { ReuniaoEditar } from '@/app/pages/reuniao/reuniao-editar/reuniao-editar';
import { Dashboard } from '@/app/pages/dashboard/dashboard';

export default [
    { path: 'home', component: Dashboard },
    {
        path: 'reuniao',
        children: [
            { path: '', component: ReuniaoListar },
            { path: ':id', component: ReuniaoEditar }
        ]
    }
    // { path: 'perfil', component: Perfil },
    // { path: 'usuarios', component: UsuariosListar },
    // { path: 'usuarios/:id', component: UsuariosEditar }
] as Routes;
