import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { TooltipModule } from 'primeng/tooltip';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { EndpointEditar } from '@/app/pages/projetos/projetos-editar/components/endpoint-editar/endpoint-editar';
import { SliderModule, SliderSlideEndEvent } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-projetos-editar',
    imports: [
        CardModule,
        ButtonModule,
        TreeModule,
        TooltipModule,
        DynamicDialogModule,
        SliderModule,
        TagModule,
        FormsModule
    ],
    templateUrl: './projetos-editar.html',
    styleUrl: './projetos-editar.scss'
})
export class ProjetosEditar implements OnInit {
    loading = signal<boolean>(false);
    loadingEndpoints = signal<Record<number, boolean>>({});
    files = signal<TreeNode[]>([]);
    public readonly _dialogService = inject(DialogService);
    public readonly id: number | null = null;

    private readonly route = inject(ActivatedRoute);
    private readonly _endpointsService = inject(EndpointsService);

    constructor() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
    }

    isLoading(endpointId: number): boolean {
        return this.loadingEndpoints()[endpointId] ?? false;
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
                            data: {
                                endpoint: e
                            }
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

    protected async gerarDadosMock($event: SliderSlideEndEvent, data: any): Promise<void> {
        if ($event.value === undefined) {
            return;
        }

        const endpointId = data.endpoint.id;

        this.loadingEndpoints.update((state) => ({
            ...state,
            [endpointId]: true
        }));

        try {
            await lastValueFrom(this._endpointsService.generateMock(this.id!, endpointId, $event.value));
        } finally {
            this.loadingEndpoints.update((state) => ({
                ...state,
                [endpointId]: false
            }));
        }
    }

    getEndpointURL(value: string): string {
        const base = `${environment.apiUrl}/admin/`;
        return base + value;
    }
}
