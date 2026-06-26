import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './forgot-password.html'
})
export class ForgotPassword {
    public isLoading = signal<boolean>(false);
    public isSubmitted = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);
    public forgotForm = this.fb.group({
        username_or_email: ['', [Validators.required]],
    });
    private messageService = inject(MessageService);

    public onSubmit(): void {
        if (this.forgotForm.invalid) {
            this.forgotForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.forgotForm.disable();

        const data = this.forgotForm.getRawValue();

        this.authService.requestPasswordReset(data.username_or_email).subscribe({
            next: (response: any) => {
                this.forgotForm.enable();
                this.isSubmitted.set(true);
            },
            error: (err) => {
                this.forgotForm.enable();
                this.errorMessage.set('Ocorreu um erro ao processar sua solicitação.');
                this.isLoading.set(false);
            }
        });
    }
}
