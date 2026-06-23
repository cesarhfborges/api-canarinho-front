import { Component, inject, OnInit, signal } from '@angular/core';
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
        AppFloatingConfigurator,
        ReactiveFormsModule,
        Logotipo
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(NonNullableFormBuilder);

    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);

    private messageService = inject(MessageService);
    public configService = inject(ConfigService);

    public loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [false, [Validators.required]]
    });

    ngOnInit() {
        if (!environment.production) {
            this.loginForm.patchValue({
                username: 'admin',
                password: 'canarinho1234'
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
            }
        });
    }
}
