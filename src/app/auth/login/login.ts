import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';
import { environment } from '@/environments/environment';
import { MessageService } from 'primeng/api';
import { ConfigService } from '@/app/core/services/config-service';

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
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login implements OnInit {
    @ViewChild('inputEmail') inputEmail!: ElementRef<HTMLInputElement>;

    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);
    public configService = inject(ConfigService);
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);
    public loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [false, [Validators.required]]
    });
    private messageService = inject(MessageService);

    ngOnInit() {
        if (!environment.production) {
            this.loginForm.patchValue({
                username: 'admin',
                password: 'canarinho1234',
                remember: false
            });
        }
    }

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.loginForm.disable();

        const credentials = this.loginForm.getRawValue();

        this.authService.login(credentials).subscribe({
            next: (response: any) => {
                this.loginForm.enable();
                void this.router.navigate(['/home']);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Login efetuado com sucesso!'
                });
            },
            error: (err) => {
                this.loginForm.enable();
                this.errorMessage.set('E-mail ou senha incorretos. Tente novamente.');
                this.isLoading.set(false);
                this.loginForm.get('password')?.reset('');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Ops',
                    detail:
                        err.error.error ??
                        'Usuário e/ou senha inválido(s), verifique as credenciais e tente novamente!.'
                });
                this.inputEmail.nativeElement.focus();
            }
        });
    }
}
