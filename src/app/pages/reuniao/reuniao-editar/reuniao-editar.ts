import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { PautaDetalhe } from '@/app/pages/reuniao/reuniao-editar/components/pauta/pauta-detalhe';
import { ReuniaoService } from '@/app/core/services/reuniao-service';
import { Reuniao } from '@/app/core/models/reuniao';
import { Pauta } from '@/app/core/models/pauta';
import { firstValueFrom } from 'rxjs';
import { Card } from 'primeng/card';
import { OpcoesVoto } from '@/app/pages/reuniao/reuniao-editar/components/opcoes-voto/opcoes-voto';
import { NaoVotantes } from '@/app/pages/reuniao/reuniao-editar/components/nao-votantes/nao-votantes';
import { DatePipe } from '@angular/common';
import { ReuniaoSocketService } from '@/app/core/services/reuniao-socket-service';

@Component({
    selector: 'app-reuniao-editar',
    imports: [StepperModule, TableModule, FormsModule, PautaDetalhe, Card, OpcoesVoto, NaoVotantes, DatePipe],
    templateUrl: './reuniao-editar.html',
    styleUrl: './reuniao-editar.scss'
})
export class ReuniaoEditar implements OnInit {
    @Input() id: number | null = null;

    protected reuniao = signal<Reuniao | null>(null);

    protected pautaSelecionada = signal<Pauta | null>(null);

    private readonly reuniaoService = inject(ReuniaoService);
    private readonly socket = inject(ReuniaoSocketService);

    async ngOnInit(): Promise<void> {
        if (this.id) {
            await this.carregarReuniao(this.id);
        }
        this.socket.connect();
    }

    protected selecionarPauta(pauta: Pauta): void {
        this.pautaSelecionada.set(pauta);
    }

    private async carregarReuniao(id: number): Promise<void> {
        const reuniao = await firstValueFrom(this.reuniaoService.get(id));

        this.reuniao.set(reuniao);
    }
}
