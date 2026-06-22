import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PerfilService } from '@/app/core/services/perfil-service';
import { UsuarioSenhaModal } from '@/app/shared/components/usuario-senha-modal/usuario-senha-modal';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule],
    providers: [DialogService],
    templateUrl: './perfil.html'
})
export class PerfilComponent {
    private fb = inject(FormBuilder);
    private perfilService = inject(PerfilService);
    private messageService = inject(MessageService);
    private dialogService = inject(DialogService);

    form: FormGroup;
    saving = signal<boolean>(false);

    constructor() {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]]
        });

        // Initialize form with current profile data
        effect(() => {
            const profile = this.perfilService.userProfile();
            if (profile) {
                this.form.patchValue({
                    name: profile.name,
                    email: profile.email
                }, { emitEvent: false });
            }
        });
    }

    alterarSenha() {
        this.dialogService.open(UsuarioSenhaModal, {
            header: 'Alterar Senha',
            modal: true,
            closable: true,
            width: '400px',
            data: { isProfile: true }
        });
    }

    salvar() {
        if (this.form.invalid) return;

        this.saving.set(true);
        this.perfilService.updatePerfil(this.form.value).subscribe({
            next: (profile) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado com sucesso!' });
                this.saving.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao atualizar perfil.' });
                this.saving.set(false);
            }
        });
    }
}
