import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-projeto-editar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
    template: `
        <form [formGroup]="form" (ngSubmit)="salvar()" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="name">Nome do Projeto <span class="text-red-500">*</span></label>
                <input pInputText id="name" formControlName="name" placeholder="Ex: E-commerce Mock" />
                <small class="text-red-500" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
                    O nome é obrigatório.
                </small>
            </div>

            <div class="flex flex-col gap-2">
                <label for="slug">Slug <span class="text-red-500">*</span></label>
                <input pInputText id="slug" formControlName="slug" placeholder="Ex: ecommerce-mock" />
                <small class="text-muted-color">O slug será usado na URL da API.</small>
                <small class="text-red-500" *ngIf="form.get('slug')?.invalid && form.get('slug')?.touched">
                    O slug é obrigatório.
                </small>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <p-button label="Cancelar" icon="pi pi-times" [outlined]="true" severity="secondary" (onClick)="cancelar()" />
                <p-button label="Salvar" icon="pi pi-check" type="submit" [loading]="loading" [disabled]="form.invalid" />
            </div>
        </form>
    `
})
export class ProjetoEditar implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig);
    private readonly projetosService = inject(ProjetosService);
    private readonly messageService = inject(MessageService);

    form!: FormGroup;
    loading = false;
    projetoId?: number;

    ngOnInit(): void {
        const projeto = this.config.data?.projeto;
        
        if (projeto) {
            this.projetoId = projeto.id;
        }

        this.form = this.fb.group({
            name: [projeto?.name || '', Validators.required],
            slug: [projeto?.slug || '', Validators.required]
        });
    }

    salvar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        const dados = this.form.value;

        if (this.projetoId) {
            this.projetosService.atualizar(this.projetoId, dados).subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Projeto atualizado com sucesso.' });
                    this.loading = false;
                    this.ref.close(res);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao atualizar projeto.' });
                    this.loading = false;
                }
            });
        } else {
            this.projetosService.criar(dados).subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Projeto criado com sucesso.' });
                    this.loading = false;
                    this.ref.close(res);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao criar projeto.' });
                    this.loading = false;
                }
            });
        }
    }

    cancelar(): void {
        this.ref.close();
    }
}
