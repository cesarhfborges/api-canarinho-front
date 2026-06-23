import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ConfigService } from '@/app/core/services/config-service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-configuracoes',
    standalone: true,
    imports: [
        ButtonModule,
        InputNumberModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        RippleModule
    ],
    templateUrl: './configuracoes.html'
})
export class Configuracoes implements OnInit {
    private fb = inject(NonNullableFormBuilder);
    private configService = inject(ConfigService);
    private messageService = inject(MessageService);

    public isLoading = signal<boolean>(false);
    public isClearingCache = signal<boolean>(false);

    public configForm = this.fb.group({
        allow_register: [false],
        rate_limit_requests: [2000],
        rate_limit_time: [60]
    });

    ngOnInit() {
        const currentConfig = this.configService.config();
        
        let allowRegister = currentConfig.allow_register;
        if (typeof allowRegister === 'string') {
            allowRegister = allowRegister === 'true' || allowRegister === '1';
        }

        this.configForm.patchValue({
            allow_register: Boolean(allowRegister),
            rate_limit_requests: Number(currentConfig.rate_limit_requests) || 2000,
            rate_limit_time: Number(currentConfig.rate_limit_time) || 60
        });
    }

    public onSubmit() {
        this.isLoading.set(true);
        const data = this.configForm.getRawValue();

        this.configService.updateConfig(data).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Configurações salvas com sucesso!'
                });
            },
            error: () => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar as configurações.'
                });
            }
        });
    }

    public clearCache() {
        this.isClearingCache.set(true);
        this.configService.clearCache().subscribe({
            next: () => {
                this.isClearingCache.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cache do sistema limpo com sucesso!'
                });
            },
            error: () => {
                this.isClearingCache.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao limpar cache.'
                });
            }
        });
    }
}
