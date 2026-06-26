import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        ButtonModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './reset-password.html'
})
export class ResetPassword implements OnInit {
    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);
    public resetForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
    });
    private messageService = inject(MessageService);
    private token: string | null = null;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            if (!this.token) {
                this.errorMessage.set('Token de recuperação não fornecido.');
            }
        });
    }

    public onSubmit(): void {
        if (this.resetForm.invalid || !this.token) {
            this.resetForm.markAllAsTouched();
            return;
        }

        const data = this.resetForm.getRawValue();

        if (data.password !== data.password_confirmation) {
            this.errorMessage.set('As senhas não coincidem.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.resetForm.disable();

        this.authService.changePassword({ ...data, token: this.token }).subscribe({
            next: (response: any) => {
                this.resetForm.enable();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message || 'Senha alterada com sucesso.'
                });
                void this.router.navigate(['/login']);
            },
            error: (err) => {
                this.resetForm.enable();
                this.errorMessage.set(err.error?.message || 'Ocorreu um erro ao alterar sua senha. O token pode estar expirado.');
                this.isLoading.set(false);
            }
        });
    }
}
