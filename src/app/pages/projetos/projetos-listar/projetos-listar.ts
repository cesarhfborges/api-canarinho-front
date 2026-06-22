import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DataView } from 'primeng/dataview';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ProjetoEditar } from '../components/projeto-editar/projeto-editar';

@Component({
    selector: 'app-projetos-listar',
    imports: [Button, Card, DataView, RouterLink],
    providers: [DialogService],
    templateUrl: './projetos-listar.html',
    styleUrl: './projetos-listar.scss'
})
export class ProjetosListar implements OnInit {
    listaProjetos = signal<any[]>([]);
    loading = signal<boolean>(false);

    private readonly _projetosService = inject(ProjetosService);
    private readonly messageService = inject(MessageService);
    private readonly _dialogService = inject(DialogService);

    ngOnInit(): void {
        this.carregarProjetos();
    }

    carregarProjetos(): void {
        this.loading.set(true);
        this._projetosService.listar().subscribe({
            next: (result) => {
                this.listaProjetos.set(result);
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a lista de projetos.', life: 3000 });
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    abrirModal(projeto?: any): void {
        const isEdit = !!projeto;
        const ref = this._dialogService.open(ProjetoEditar, {
            header: isEdit ? 'Editar Projeto' : 'Cadastrar Novo Projeto',
            width: '450px',
            modal: true,
            closable: true,
            data: { projeto }
        });

        ref?.onClose?.subscribe((result) => {
            if (result) {
                this.carregarProjetos();
            }
        });
    }
}
