import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ReuniaoService } from '@/app/core/services/reuniao-service';
import { Reuniao } from '@/app/core/models/reuniao';
import { Tag } from 'primeng/tag';
import { ReuniaoStatus } from '@/app/core/models/reuniao.status';
import { DatePipe } from '@angular/common';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reuniao-listar',
    imports: [TableModule, Tag, DatePipe, SplitButton],
    templateUrl: './reuniao-listar.html',
    styleUrl: './reuniao-listar.scss'
})
export class ReuniaoListar implements OnInit {
    public loading = {
        listar: false
    };

    public tableConfig: any = {
        dataKey: 'id',
        filter: {
            fields: ['id', 'titulo', 'descricao', 'status', 'dataHoraInicio', 'dataHoraFim']
        }
    };
    public lista = signal<Reuniao[]>([]);
    protected readonly ReuniaoStatus = ReuniaoStatus;
    private reuniaoSelecionada: Reuniao | null = null;
    protected menuItems: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.reuniaoSelecionada) this.update(this.reuniaoSelecionada);
            }
        },
        { separator: true },
        {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => {
                if (this.reuniaoSelecionada) this.delete(this.reuniaoSelecionada);
            }
        }
    ];
    private readonly reuniaoService = inject(ReuniaoService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.loading.listar = true;
        this.reuniaoService.listar().subscribe({
            next: (data) => {
                console.log(data);
                this.lista.set(data);
                this.loading.listar = false;
            }
        });
    }

    update(reuniao: Reuniao) {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Data ${this.reuniaoSelecionada?.titulo} Updated` });
    }

    delete(reuniao: Reuniao) {
        this.messageService.add({ severity: 'error', summary: 'Delete', detail: `Data ${this.reuniaoSelecionada?.titulo} Deleted` });
    }

    entrar(reuniao: Reuniao) {
        this.messageService.add({ severity: 'info', summary: 'Entrar', detail: `Entrando ${reuniao.titulo} na reunião` });
        void this.router.navigate(['/reuniao', reuniao.id]);
    }

    protected definirItemAtivo(item: Reuniao): void {
        this.reuniaoSelecionada = item;
    }
}
