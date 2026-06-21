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
import { MessageService } from 'primeng/api';
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
    private readonly messageService = inject(MessageService);

    generatingAll = signal<boolean>(false);

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
            modal: true,
            closable: true,
            data: {
                resource: value,
                projectId: this.id
            },
            breakpoints: {
                '1920px': '75vw',
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
            this.loading.set(true);
            this._endpointsService.excluir(value.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Endpoint excluído com sucesso.', life: 3000 });
                    void this.carregar();
                    this.loading.set(false);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao excluir o endpoint.', life: 3000 });
                    console.error(err);
                    this.loading.set(false);
                }
            });
        }
    }

    private async carregar() {
        if (this.id !== null) {
            try {
                this.loading.set(true);
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
            } catch (err) {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar os dados do projeto.', life: 3000 });
                console.error(err);
            } finally {
                this.loading.set(false);
            }
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
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Token gerado com sucesso.', life: 3000 });
                this.showTokenDialog.set(false);
                void this.carregar();
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível gerar o token.', life: 3000 });
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    excluirToken(token: any) {
        if (confirm(`Tem certeza que deseja revogar o token ${token.name}?`)) {
            this.loading.set(true);
            this._tokensService.excluir(token.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Token revogado.', life: 3000 });
                    void this.carregar();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao revogar o token.', life: 3000 });
                    console.error(err);
                    this.loading.set(false);
                }
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

        await this.updateCount(data.endpoint.id, $event.value);
    }

    private async updateCount(endpointId: number, count: number) {
        this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: true }));
        try {
            await lastValueFrom(this._endpointsService.generateMock(this.id!, endpointId, count));
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mocks gerados com sucesso.', life: 3000 });
            await this.carregar();
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar os dados mockados.', life: 3000 });
            console.error(err);
        } finally {
            this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: false }));
        }
    }

    async gerarTodos() {
        if (this.id === null) return;

        const endpoints = this.files();
        if (!endpoints || endpoints.length === 0) return;

        this.generatingAll.set(true);
        let hasError = false;

        // Set ALL endpoints to loading initially to lock the UI
        const newLoadingState = { ...this.loadingEndpoints() };
        for (const item of endpoints) {
            newLoadingState[item.data.endpoint.id] = true;
        }
        this.loadingEndpoints.set(newLoadingState);

        for (const item of endpoints) {
            const endpointId = item.data.endpoint.id;

            try {
                // Creates automatically 10 items for each
                await lastValueFrom(this._endpointsService.generateMock(this.id, endpointId, 10));
                // Update local model so UI reflects it immediately
                item.data.endpoint.count = 10;
                // Set only this endpoint to false as it finished
                this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: false }));
            } catch (err) {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao gerar dados para ${item.label}`, life: 3000 });
                console.error(err);
                hasError = true;
                break; // Stop processing further endpoints on error
            }
        }

        // If an error occurred, we need to unlock any endpoints that are still loading
        if (hasError) {
            const resetState = { ...this.loadingEndpoints() };
            for (const item of endpoints) {
                resetState[item.data.endpoint.id] = false;
            }
            this.loadingEndpoints.set(resetState);
        } else {
            this.messageService.add({ severity: 'success', summary: 'Concluído', detail: 'Dados mockados gerados para todos os endpoints (10 itens cada).', life: 3000 });
        }

        await this.carregar();
        this.generatingAll.set(false);
    }

    getEndpointURL(value: string): string {
        const base = `${environment.apiUrl}/admin/`;
        return base + value;
    }
}
