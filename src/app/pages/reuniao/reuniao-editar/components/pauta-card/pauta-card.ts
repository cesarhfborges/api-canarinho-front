import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';

import { firstValueFrom, interval, lastValueFrom, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Pauta } from '@/app/core/models/pauta';
import { VotacaoService } from '@/app/core/services/votacao-service';
import { AbrirVotacao } from '@/app/pages/reuniao/reuniao-editar/components/abrir-votacao/abrir-votacao';
import { ReuniaoSocketService } from '@/app/core/services/reuniao-socket-service';
import { PautaService } from '@/app/core/services/pauta-service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-pauta-card',
    imports: [Button, ProgressBar, DatePipe, DecimalPipe],
    templateUrl: './pauta-card.html',
    styleUrl: './pauta-card.scss'
})
export class PautaCard implements OnInit {
    readonly reuniaoId = input.required<number>();
    readonly pauta = input.required<Pauta>();
    readonly estaSelecionada = input(false);

    readonly onSelecionar = output<Pauta>();
    readonly onEditar = output<Pauta>();
    readonly onExcluir = output<number>();

    readonly agora = signal(Date.now());

    readonly infoTempo = computed(() => {
        const pauta = this.pauta();
        const agora = this.agora();
        if (pauta.status !== 'ABERTA' || !pauta.dataHoraAbertura || !pauta.tempo) {
            return {
                restante: '00:00:00',
                percentual: 0,
                menosDeUmMinuto: false
            };
        }
        const inicio = new Date(pauta.dataHoraAbertura).getTime();
        const duracao = this.tempoParaMs(pauta.tempo);
        const fim = inicio + duracao;
        const restanteMs = Math.max(0, fim - agora);
        const percentual = Math.min(100, Math.max(0, ((agora - inicio) / duracao) * 100));
        const totalSegundos = Math.floor(restanteMs / 1000);
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);
        const segundos = totalSegundos % 60;
        return {
            restante: [horas, minutos, segundos].map((v) => String(v).padStart(2, '0')).join(':'),

            percentual,

            menosDeUmMinuto: horas === 0 && minutos === 0 && segundos <= 59
        };
    });

    private readonly destroyRef = inject(DestroyRef);
    private readonly votacaoService = inject(VotacaoService);
    private readonly dialogService = inject(DialogService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly pautaService = inject(PautaService);
    private readonly socket = inject(ReuniaoSocketService);

    ngOnInit(): void {
        interval(1000)
            .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.agora.set(Date.now());
            });
        this.socket
            .subscribe(`/topic/reunioes/${this.reuniaoId()}`)
            .pipe(filter((evento: any) => evento.pautaId === this.pauta().id))
            .subscribe((evento) => {
                console.log(evento);
                void this.carregarPauta();
            });
    }

    async carregarPauta(): Promise<void> {
        const pautas = await firstValueFrom(this.pautaService.get(this.reuniaoId(), this.pauta().id));
        console.log('carregarPauta: ', pautas);
        // this.pauta = pauta;
    }

    async fecharVotacao(event: Event): Promise<void> {
        event.stopImmediatePropagation();

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Atenção',
            message: 'Deseja encerrar esta votação?',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Sim, encerrar votação',
                severity: 'danger'
            },
            accept: async () => {
                await lastValueFrom(this.votacaoService.fecharVotacao(this.reuniaoId(), this.pauta().id));

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Votação encerrada.'
                });
            }
        });
    }

    async abrirVotacao(event: Event): Promise<void> {
        event.stopImmediatePropagation();

        const config: DynamicDialogConfig = {
            header: 'Abrir votação',
            width: '30vw',
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
                reuniaoId: this.reuniaoId(),
                pautaId: this.pauta().id
            }
        };

        const ref = this.dialogService.open(AbrirVotacao, config);

        ref?.onClose.subscribe({
            next: (result) => {
                if (!result) {
                    return;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Votação aberta.'
                });
            }
        });
    }

    protected selecionar(): void {
        this.onSelecionar.emit(this.pauta());
    }

    protected editar(event: Event): void {
        event.stopPropagation();
        this.onEditar.emit(this.pauta());
    }

    protected excluir(event: Event): void {
        event.stopPropagation();
        this.onExcluir.emit(this.pauta().id);
    }

    private tempoParaMs(tempo: string): number {
        const [horas, minutos, segundos] = tempo.split(':').map(Number);

        return (horas * 3600 + minutos * 60 + segundos) * 1000;
    }
}
