import { Component, input, output, signal } from '@angular/core';
import { Pauta } from '@/app/core/models/pauta';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-pauta-card',
    imports: [Button, Tag, DatePipe],
    templateUrl: './pauta-card.html',
    styleUrl: './pauta-card.scss'
})
export class PautaCard {
    readonly pauta = input.required<Pauta>();

    readonly estaSelecionada = input(false);

    readonly onSelecionar = output<Pauta>();

    readonly onEditar = output<Pauta>();

    readonly onExcluir = output<number>();

    protected aberto = signal<boolean>(false);

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
}
