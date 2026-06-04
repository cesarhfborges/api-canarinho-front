import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Error } from './error/error';
import { Access } from '@/app/auth/access/access';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login }
] as Routes;
