import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { AppFloatingConfigurator } from '@/app/shared/layout/component/app.floatingconfigurator';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';
import { MessageService } from 'primeng/api';
import { ConfigService } from '@/app/core/services/config-service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register {
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);

    public isLoading = signal<boolean>(false);

    private messageService = inject(MessageService);
    public configService = inject(ConfigService);

    public registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    public onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { name, email, password, confirmPassword } = this.registerForm.getRawValue();
        
        if (password !== confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'As senhas não coincidem.'
            });
            return;
        }

        this.isLoading.set(true);
        this.registerForm.disable();

        const userData = { name, email, password };

        this.authService.register(userData).subscribe({
            next: (response: any) => {
                this.registerForm.enable();
                void this.router.navigate(['/login']);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cadastro efetuado com sucesso! Faça login para continuar.'
                });
            },
            error: (err) => {
                this.registerForm.enable();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao realizar cadastro. Tente novamente.'
                });
                this.isLoading.set(false);
            }
        });
    }
}
