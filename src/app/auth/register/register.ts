import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
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
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register implements OnInit {
    public isLoading = signal<boolean>(false);
    public configService = inject(ConfigService);
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);
    public registerForm = this.fb.group({
        name: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
    });
    private messageService = inject(MessageService);

    ngOnInit() {
        this.registerForm.patchValue({
            name: 'Cesar',
            username: 'cesarhenriq',
            email: 'cesar_silk321@hotmail.com',
            password: '91344356',
            password_confirmation: '91344356'
        });
    }

    public onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { name, email, username, password, password_confirmation } = this.registerForm.getRawValue();

        if (password !== password_confirmation) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'As senhas não coincidem.'
            });
            return;
        }

        this.isLoading.set(true);
        this.registerForm.disable();

        const userData = { name, username, email, password, password_confirmation };

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
            error: (ex) => {
                console.log(ex);
                this.registerForm.enable();
                const fields = Object.keys(ex.error.messages);
                if (fields.length > 0) {
                    for (const field of fields) {
                        const error = ex.error.messages[field];
                        this.messageService.add({
                            severity: 'error',
                            summary: ex.error.error ?? 'Erro',
                            detail: error
                        });
                    }
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao realizar cadastro. Tente novamente.'
                    });
                }
                this.isLoading.set(false);
            }
        });
    }
}
