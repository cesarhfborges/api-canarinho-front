import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { TooltipModule } from 'primeng/tooltip';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { TokensService } from '@/app/core/services/tokens.service';
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
        FormsModule,
        TabsModule,
        TableModule,
        DialogModule,
        InputTextModule,
        DatePipe
    ],
    templateUrl: './projetos-editar.html',
    styleUrl: './projetos-editar.scss'
})
export class ProjetosEditar implements OnInit {
    loading = signal<boolean>(false);
    loadingEndpoints = signal<Record<number, boolean>>({});
    files = signal<TreeNode[]>([]);
    tokens = signal<any[]>([]);
    
    showTokenDialog = signal<boolean>(false);
    newTokenName = signal<string>('');

    public readonly _dialogService = inject(DialogService);
    public readonly id: number | null = null;

    private readonly route = inject(ActivatedRoute);
    private readonly _endpointsService = inject(EndpointsService);
    private readonly _tokensService = inject(TokensService);

    constructor() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
    }

    isLoading(endpointId: number): boolean {
        return this.loadingEndpoints()[endpointId] ?? false;
    }

    ngOnInit(): void {
        void this.carregar();
    }

    editar(value: any) {
        const ref = this._dialogService.open(EndpointEditar, {
            header: value ? `Edit resource - ${value.name}` : 'New resource',
            data: {
                resource: value,
                projectId: this.id
            },
            breakpoints: {
                '960px': '85vw',
                '640px': '90vw'
            }
        });
        ref?.onClose?.subscribe({
            next: (res) => {
                if (res) {
                    void this.carregar();
                }
            }
        });
    }

    excluir(value: any) {
        if (confirm(`Tem certeza que deseja excluir o endpoint ${value.name}?`)) {
            this._endpointsService.excluir(value.id).subscribe({
                next: () => {
                    void this.carregar();
                }
            });
        }
    }

    private async carregar() {
        if (this.id !== null) {
            const endpoints = await this.getEndpoints(this.id);
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
            
            const loadedTokens = await lastValueFrom(this._tokensService.listar(this.id));
            this.tokens.set(loadedTokens);
        }
    }

    abrirModalToken() {
        this.newTokenName.set('');
        this.showTokenDialog.set(true);
    }

    gerarToken() {
        if (!this.newTokenName().trim()) return;
        this.loading.set(true);
        this._tokensService.criar(this.id!, { name: this.newTokenName() }).subscribe({
            next: () => {
                this.showTokenDialog.set(false);
                void this.carregar();
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    excluirToken(token: any) {
        if (confirm(`Tem certeza que deseja revogar o token ${token.name}?`)) {
            this._tokensService.excluir(token.id).subscribe({
                next: () => void this.carregar()
            });
        }
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
