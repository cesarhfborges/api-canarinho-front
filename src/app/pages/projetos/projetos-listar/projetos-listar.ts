import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DataView } from 'primeng/dataview';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-projetos-listar',
    imports: [Button, Card, DataView, RouterLink],
    templateUrl: './projetos-listar.html',
    styleUrl: './projetos-listar.scss'
})
export class ProjetosListar implements OnInit {
    listaProjetos = signal<any[]>([]);

    private readonly _projetosService = inject(ProjetosService);

    ngOnInit(): void {
        this.carregarProjetos();
    }

    carregarProjetos(): void {
        this._projetosService.listar().subscribe({
            next: (result) => {
                console.log(result);
                this.listaProjetos.set(result);
            }
        });
    }
}
