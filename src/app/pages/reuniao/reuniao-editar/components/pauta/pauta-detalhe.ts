import { Component, inject, input, output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Pauta } from '@/app/core/models/pauta';
import { Card } from 'primeng/card';
import { PautaService } from '@/app/core/services/pauta-service';
import { firstValueFrom } from 'rxjs';
import { PautaCard } from '@/app/pages/reuniao/reuniao-editar/components/pauta-card/pauta-card';
import { DialogService } from 'primeng/dynamicdialog';
import { PautaEditar } from '@/app/pages/reuniao/reuniao-editar/components/pauta-editar/pauta-editar';

@Component({
    selector: 'app-pauta-detalhe',
    imports: [Button, Card, PautaCard],
    templateUrl: './pauta-detalhe.html',
    styleUrl: './pauta-detalhe.scss'
})
export class PautaDetalhe {
    readonly reuniaoId = input.required<number>();

    readonly pautaSelecionada = input<Pauta | null>(null);

    readonly onSelecionarPauta = output<Pauta>();

    protected pautas = signal<Pauta[]>([]);

    private readonly pautaService = inject(PautaService);
    private readonly dialogService = inject(DialogService);

    async ngOnInit(): Promise<void> {
        await this.carregarPautas();
    }

    protected selecionarPauta(pauta: Pauta): void {
        this.onSelecionarPauta.emit(pauta);
    }

    protected abrirModalNovaPauta(): void {
        const ref = this.dialogService.open(PautaEditar, {
            header: 'Cadastrar',
            width: '50vw',
            modal: true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {}
        });
    }

    protected editarPauta(pauta: Pauta): void {
        const ref = this.dialogService.open(PautaEditar, {
            header: 'Editar',
            width: '50vw',
            modal: true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                pauta: pauta
            }
        });
    }

    protected async excluirPauta(id: number): Promise<void> {
        console.log('excluir pauta', id);

        // await firstValueFrom(this.pautaService.excluir(id));
        // await this.carregarPautas();
    }

    private async carregarPautas(): Promise<void> {
        const pautas = await firstValueFrom(this.pautaService.listar(this.reuniaoId()));
        this.pautas.set(pautas);
    }
}
