import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { TooltipModule } from 'primeng/tooltip';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { EndpointEditar } from '@/app/pages/projetos/projetos-editar/components/endpoint-editar/endpoint-editar';

@Component({
    selector: 'app-projetos-editar',
    imports: [CardModule, ButtonModule, TreeModule, TooltipModule, DynamicDialogModule],
    templateUrl: './projetos-editar.html',
    styleUrl: './projetos-editar.scss'
})
export class ProjetosEditar implements OnInit {
    files = signal<TreeNode[]>([]);
    public readonly _dialogService = inject(DialogService);
    public readonly id: number | null = null;

    private readonly route = inject(ActivatedRoute);
    private readonly _endpointsService = inject(EndpointsService);

    constructor() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
    }

    ngOnInit(): void {
        if (this.id !== null) {
            void this.getEndpoints(this.id).then((endpoints) => {
                console.log(endpoints);
                this.files.set(
                    endpoints.map((e) => {
                        return {
                            key: e.id,
                            label: e.name,
                            data: e
                        };
                    })
                );
            });
        }
    }

    editar(value: any) {
        const ref = this._dialogService.open(EndpointEditar, {
            header: 'Edit resource - pagamentos',
            data: {
                resource: value
            },
            breakpoints: {
                '960px': '85vw',
                '640px': '90vw'
            }
        });
        ref?.onClose?.subscribe({
            next: () => {
                console.log('Closed');
            }
        });
    }

    async getEndpoints(id: number): Promise<any[]> {
        return await lastValueFrom(this._endpointsService.listar(id));
    }
}
