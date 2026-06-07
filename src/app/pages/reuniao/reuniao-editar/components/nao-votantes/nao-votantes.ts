import { Component, effect, inject, input, signal } from '@angular/core';
import { Pauta } from '@/app/core/models/pauta';
import { BloqueioVotoService } from '@/app/core/services/bloqueio-voto-service';
import { BloqueioVoto } from '@/app/core/models/bloqueio-voto';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { Reuniao } from '@/app/core/models/reuniao';
import { Tooltip } from 'primeng/tooltip';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NaoVotanteEditar } from '@/app/pages/reuniao/reuniao-editar/components/nao-votante-editar/nao-votante-editar';

@Component({
    selector: 'app-nao-votantes',
    imports: [Button, TableModule, Card, Tooltip],
    templateUrl: './nao-votantes.html',
    styleUrl: './nao-votantes.scss'
})
export class NaoVotantes {
    readonly reuniao = input.required<Reuniao>();
    readonly pauta = input.required<Pauta>();

    protected lista = signal<BloqueioVoto[]>([]);

    protected loading = signal(false);

    private readonly dialogService = inject(DialogService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly bloqueioVotoService = inject(BloqueioVotoService);

    constructor() {
        effect(() => {
            const reuniao = this.reuniao();
            const pauta = this.pauta();

            if (pauta?.id) {
                void this.carregarBloqueios(reuniao.id, pauta.id);
            }
        });
    }

    protected abrirModalBloqueio(opcao?: any): void {
        const config: DynamicDialogConfig = {
            header: 'Cadastrar',
            width: '50vw',
            modal: true,
            focusTrap: true,
            dismissableMask: false,
            draggable: false,
            closable: true,
            position: 'center',
            appendTo: 'body',
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            inputValues: {
                reuniaoId: this.reuniao().id,
                pautaId: this.pauta().id,
                selecionados: this.lista().map((item) => item.funcionarioId)
            }
        };

        if (opcao) {
            config.data = {
                opcao: opcao
            };
        }

        const ref = this.dialogService.open(NaoVotanteEditar, config);

        ref?.onClose.subscribe({
            next: (result: any | undefined) => {
                console.log('onClose', result);
                if (!result) {
                    return;
                }
                this.loading.set(true);
                if (opcao) {
                    this.lista.update((lista) => {
                        return lista.map((item) => (item.id === result.id ? result : item));
                    });
                    this.messageService.add({ severity: 'warn', summary: 'Sucesso', detail: 'Usuário adicionado com sucesso.' });
                } else {
                    this.lista.update((lista) => [...lista, result]);
                    this.messageService.add({ severity: 'warn', summary: 'Sucesso', detail: 'Usuário adicionado com sucesso.' });
                }
                this.loading.set(false);
            }
        });
    }

    protected async confirmarExcluir(event: Event, id: number): Promise<void> {
        console.log('excluir opção', id);
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Atenção',
            message: 'Deseja excluir este registro?',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Sim, excluir',
                severity: 'danger'
            },
            accept: () => this.removerBloqueio(id)
        });
    }

    protected async removerBloqueio(id: number): Promise<void> {
        const reuniao = this.reuniao();
        const pauta = this.pauta();
        await firstValueFrom(this.bloqueioVotoService.excluir(reuniao.id, pauta.id, id));
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário removido com sucesso.' });
        this.lista.update((lista) => lista.filter((opcao) => opcao.id !== id));
    }

    private async carregarBloqueios(reuniaoId: number, pautaId: number): Promise<void> {
        this.loading.set(true);
        try {
            const bloqueios = await firstValueFrom(this.bloqueioVotoService.listar(reuniaoId, pautaId));
            this.lista.set(bloqueios);
        } finally {
            this.loading.set(false);
        }
    }
}
