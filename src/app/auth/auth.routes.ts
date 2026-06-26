import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Error } from './error/error';
import { Access } from '@/app/auth/access/access';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'alterar-senha', component: ResetPassword }
] as Routes;
