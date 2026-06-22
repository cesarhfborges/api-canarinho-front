import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuariosService } from '@/app/core/services/usuarios-service';
import { PerfilService } from '@/app/core/services/perfil-service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmation = control.get('password_confirmation')?.value;
    if (password && confirmation && password !== confirmation) {
        return { mismatch: true };
    }
    return null;
};

@Component({
    selector: 'app-usuario-senha-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PasswordModule, ButtonModule],
    templateUrl: './usuario-senha-modal.html'
})
export class UsuarioSenhaModal {
    isProfile = false;
    userId: number | null = null;

    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private usuariosService = inject(UsuariosService);
    private perfilService = inject(PerfilService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);

    form: FormGroup;
    saving = signal<boolean>(false);

    constructor() {
        this.isProfile = this.config.data?.isProfile || false;
        this.userId = this.config.data?.userId || null;
        
        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            password_confirmation: ['', [Validators.required]]
        }, { validators: passwordMatchValidator });
    }

    fechar(success = false) {
        this.ref.close(success);
    }

    salvar() {
        if (this.form.invalid) return;

        this.saving.set(true);
        const data = this.form.value;

        const request$ = this.isProfile 
            ? this.perfilService.updatePassword(data)
            : this.usuariosService.atualizarSenha(this.userId!, data);

        request$.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha atualizada com sucesso!' });
                this.saving.set(false);
                this.fechar(true);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao atualizar a senha.' });
                this.saving.set(false);
            }
        });
    }
}
