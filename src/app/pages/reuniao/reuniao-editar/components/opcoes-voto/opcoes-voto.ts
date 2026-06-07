import { Component, effect, ElementRef, inject, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { OpcaoVoto } from '@/app/core/models/opcao-voto';
import { Pauta } from '@/app/core/models/pauta';
import { OpcaoVotoService } from '@/app/core/services/opcao-voto-service';
import { Card } from 'primeng/card';
import { Reuniao } from '@/app/core/models/reuniao';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OpcoesEditar } from '@/app/pages/reuniao/reuniao-editar/components/opcoes-editar/opcoes-editar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { ReordenarOpcaoVoto } from '@/app/core/models/reordenar-opcao-voto';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-opcoes-voto',
    imports: [TableModule, Button, Card, Tooltip, Tag],
    templateUrl: './opcoes-voto.html',
    styleUrl: './opcoes-voto.scss'
})
export class OpcoesVoto {
    readonly reuniao = input.required<Reuniao>();
    readonly pauta = input.required<Pauta>();

    protected lista = signal<OpcaoVoto[]>([]);
    protected loading = signal<boolean>(false);

    private readonly elementRef = inject(ElementRef);
    private readonly dialogService = inject(DialogService);
    private readonly messageService = inject(MessageService);
    private readonly opcaoVotoService = inject(OpcaoVotoService);
    private readonly confirmationService = inject(ConfirmationService);

    constructor() {
        effect(() => {
            const reuniao = this.reuniao();
            const pauta = this.pauta();

            if (pauta?.id) {
                void this.carregarOpcoes(reuniao.id, pauta.id);
            }
        });
    }

    protected abrirModalOpcao(opcao?: OpcaoVoto): void {
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
                pautaId: this.pauta().id
            }
        };

        if (opcao) {
            config.data = {
                opcao: opcao
            };
        }

        const ref = this.dialogService.open(OpcoesEditar, config);

        ref?.onClose.subscribe({
            next: (result: OpcaoVoto | undefined) => {
                console.log('onClose', result);
                if (!result) {
                    return;
                }
                this.loading.set(true);
                if (opcao) {
                    this.lista.update((lista) => {
                        return lista.map((item) => (item.id === result.id ? result : item));
                    });
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Opção atualizada com sucesso.' });
                } else {
                    this.lista.update((lista) => [...lista, result]);
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Opção cadastrada com sucesso.' });
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
            accept: () => this.excluirOpcao(id)
        });
    }

    protected async aoReOrdenar(index: number, direction: 'up' | 'down'): Promise<void> {
        const before = new Map<number, DOMRect>();

        this.obterLinhasTabela().forEach((row) => {
            const id = Number(row.dataset['id']);

            if (!Number.isNaN(id)) {
                before.set(id, row.getBoundingClientRect());
            }
        });

        this.lista.update((lista) => {
            const novaLista = [...lista];

            const novoIndex = direction === 'up' ? index - 1 : index + 1;

            if (novoIndex < 0 || novoIndex >= novaLista.length) {
                return lista;
            }

            [novaLista[index], novaLista[novoIndex]] = [novaLista[novoIndex], novaLista[index]];

            return novaLista.map((item, idx) => ({
                ...item,
                ordem: idx + 1
            }));
        });

        try {
            await firstValueFrom(this.opcaoVotoService.reordenar(this.reuniao().id, this.pauta().id, this.obterPayloadReordenacao()));
        } catch {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível salvar a nova ordem.'
            });

            await this.carregarOpcoes(this.reuniao().id, this.pauta().id);

            return;
        }

        requestAnimationFrame(() => {
            this.obterLinhasTabela().forEach((row) => {
                const id = Number(row.dataset['id']);

                const first = before.get(id);

                if (!first) {
                    return;
                }

                const last = row.getBoundingClientRect();

                const deltaY = first.top - last.top;

                if (Math.abs(deltaY) < 1) {
                    return;
                }

                row.animate(
                    [
                        {
                            transform: `translateY(${deltaY}px) scaleY(1)`
                        },
                        {
                            offset: 0.5,
                            transform: `translateY(${deltaY * 0.15}px) scaleY(1.2)`
                        },
                        {
                            transform: 'translateY(0) scaleY(1)'
                        }
                    ],
                    {
                        duration: 350,
                        easing: 'ease-out'
                    }
                );
            });
        });
    }

    private async excluirOpcao(id: number): Promise<void> {
        try {
            await firstValueFrom(this.opcaoVotoService.excluir(this.reuniao().id, this.pauta().id, id));
            this.lista.update((lista) => lista.filter((opcao) => opcao.id !== id));
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Ops', detail: 'Não foi possível executar esta ação.' });
        }
    }

    private async carregarOpcoes(reuniaoId: number, pautaId: number): Promise<void> {
        this.loading.set(true);

        try {
            const opcoes = await firstValueFrom(this.opcaoVotoService.listar(reuniaoId, pautaId));
            console.log(opcoes);
            this.lista.set(opcoes);
        } finally {
            this.loading.set(false);
        }
    }

    private obterLinhasTabela(): HTMLElement[] {
        return Array.from(this.elementRef.nativeElement.querySelectorAll('.p-datatable-tbody > tr[data-id]')) as HTMLElement[];
    }

    private obterPayloadReordenacao(): ReordenarOpcaoVoto[] {
        return this.lista().map((item) => ({
            id: item.id,
            ordem: item.ordem
        }));
    }
}
