import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuariosService } from '@/app/core/services/usuarios-service';
import { UserProfile } from '@/app/core/services/perfil-service';

@Component({
    selector: 'app-usuario-editar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToggleSwitchModule],
    templateUrl: './usuario-editar.html'
})
export class UsuarioEditar {
    isEdit = signal<boolean>(false);
    userToEdit: UserProfile | null = null;

    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private usuariosService = inject(UsuariosService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);

    form!: FormGroup;
    saving = signal<boolean>(false);

    constructor() {
        this.userToEdit = this.config.data?.user || null;
        this.isEdit.set(!!this.userToEdit);
        this.buildForm();
    }

    private buildForm() {
        this.isEdit.set(!!this.userToEdit);
        
        this.form = this.fb.group({
            name: [this.userToEdit?.name || '', [Validators.required]],
            username: [this.userToEdit?.username || '', [Validators.required]],
            email: [this.userToEdit?.email || '', [Validators.required, Validators.email]],
            is_admin: [this.userToEdit ? this.userToEdit.is_admin : false],
            is_active: [this.userToEdit ? this.userToEdit.is_active : true]
        });

        if (!this.isEdit()) {
            this.form.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(6)]));
        }
    }

    fechar(success = false) {
        this.ref.close(success);
    }

    salvar() {
        if (this.form.invalid) return;

        this.saving.set(true);
        const request$ = this.isEdit() 
            ? this.usuariosService.atualizar(this.userToEdit!.id, this.form.value)
            : this.usuariosService.criar(this.form.value);

        request$.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ${this.isEdit() ? 'atualizado' : 'criado'} com sucesso!` });
                this.saving.set(false);
                this.fechar(true);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao salvar usuário.' });
                this.saving.set(false);
            }
        });
    }
}
