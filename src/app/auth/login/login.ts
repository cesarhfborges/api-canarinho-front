import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { AppFloatingConfigurator } from '@/app/shared/layout/component/app.floatingconfigurator';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './login.html'
})
export class Login {
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);

    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);

    public loginForm = this.fb.group({
        username: ['admin@admin.com', [Validators.required, Validators.email]],
        password: ['admin123', [Validators.required, Validators.minLength(6)]],
        remember: [false, [Validators.required]]
    });

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const credentials = this.loginForm.getRawValue();

        this.authService.login(credentials).subscribe({
            next: () => {
                void this.router.navigate(['/home']);
            },
            error: (err) => {
                console.error('Erro tratado no componente:', err);
                this.errorMessage.set('E-mail ou senha incorretos. Tente novamente.');
                this.isLoading.set(false);
            }
        });
    }
}
