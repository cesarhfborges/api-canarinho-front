import { Component, effect, inject, input, signal } from '@angular/core';
import { Pauta } from '@/app/core/models/pauta';
import { BloqueioVotoService } from '@/app/core/services/bloqueio-voto-service';
import { BloqueioVoto } from '@/app/core/models/bloqueio-voto';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { Reuniao } from '@/app/core/models/reuniao';

@Component({
    selector: 'app-nao-votantes',
    imports: [Button, TableModule, Card],
    templateUrl: './nao-votantes.html',
    styleUrl: './nao-votantes.scss'
})
export class NaoVotantes {
    readonly reuniao = input.required<Reuniao>();
    readonly pauta = input.required<Pauta>();

    protected lista = signal<BloqueioVoto[]>([]);

    protected carregando = signal(false);

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

    private async carregarBloqueios(reuniaoId: number, pautaId: number): Promise<void> {
        this.carregando.set(true);
        try {
            const bloqueios = await firstValueFrom(this.bloqueioVotoService.listar(reuniaoId, pautaId));
            this.lista.set(bloqueios);
        } finally {
            this.carregando.set(false);
        }
    }

    protected abrirModalBloqueio(): void {
        console.log('novo bloqueio');
    }

    protected async removerBloqueio(id: number): Promise<void> {
        console.log('remover bloqueio', id);

        // await firstValueFrom(
        //     this.bloqueioVotoService.excluir(id)
        // );

        // await this.carregarBloqueios(this.pauta().id);
    }
}
