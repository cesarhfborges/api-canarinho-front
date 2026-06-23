import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgClass } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { TooltipModule } from 'primeng/tooltip';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { TokensService } from '@/app/core/services/tokens.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { EndpointEditar } from '@/app/pages/projetos/projetos-editar/components/endpoint-editar/endpoint-editar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { SliderModule, SliderSlideEndEvent } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { environment } from '@/environments/environment';
import { EndpointVisualizar } from '@/app/pages/projetos/projetos-editar/components/endpoint-visualizar/endpoint-visualizar';

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
        DatePipe,
        NgClass
    ],
    templateUrl: './projetos-editar.html',
    styleUrl: './projetos-editar.scss'
})
export class ProjetosEditar implements OnInit {
    loading = signal<boolean>(false);
    loadingEndpoints = signal<Record<number, string | null>>({});
    visibleTokens = signal<Record<number, boolean>>({});
    files = signal<TreeNode[]>([]);
    tokens = signal<any[]>([]);

    showTokenDialog = signal<boolean>(false);
    newTokenName = signal<string>('');
    project = signal<any>(null);
    username = signal<string>('');

    public readonly _dialogService = inject(DialogService);
    public readonly id: number | null = null;

    private readonly route = inject(ActivatedRoute);
    private readonly _endpointsService = inject(EndpointsService);
    private readonly _tokensService = inject(TokensService);
    private readonly _projetosService = inject(ProjetosService);
    private readonly _perfilService = inject(PerfilService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    generatingAll = signal<boolean>(false);

    constructor() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
    }

    isLoading(endpointId: number): boolean {
        return !!this.loadingEndpoints()[endpointId];
    }

    getEndpointStatus(endpointId: number): string | null {
        return this.loadingEndpoints()[endpointId] ?? null;
    }

    toggleTokenVisibility(tokenId: number): void {
        this.visibleTokens.update((prev) => ({ ...prev, [tokenId]: !prev[tokenId] }));
    }

    isTokenVisible(tokenId: number): boolean {
        return this.visibleTokens()[tokenId] ?? false;
    }

    onTabChange(event: any): void {
        // Clear token visibility when switching tabs
        this.visibleTokens.set({});
    }

    ngOnInit(): void {
        void this.carregar();
    }

    editar(value: any) {
        const ref = this._dialogService.open(EndpointEditar, {
            header: value ? `Edit resource - ${value.name}` : 'New resource',
            modal: true,
            closable: true,
            draggable: false,
            data: {
                resource: value,
                projectId: this.id,
                username: this.username(),
                projectSlug: this.project()?.slug
            },
            styleClass: 'customize',
            breakpoints: {
                '4000px': '75vw',
                '1920px': '75vw',
                '960px': '85vw',
                '640px': '90vw',
                '10px': '90vw'
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

    visualizarDados(value: any) {
        // Validate if there is a token available
        if (this.tokens().length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Você precisa gerar ao menos um Token na aba de Tokens antes de pré-visualizar os dados.', life: 5000 });
            return;
        }

        const firstToken = this.tokens()[0].token;

        this._dialogService.open(EndpointVisualizar, {
            header: `Preview - ${value.name}`,
            modal: true,
            closable: true,
            draggable: false,
            data: {
                endpoint: value,
                projectSlug: this.project()?.slug,
                username: this.username(),
                token: firstToken
            },
            breakpoints: {
                '1920px': '75vw',
                '960px': '85vw',
                '640px': '90vw'
            }
        });
    }

    excluir(event: Event, value: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Tem certeza que deseja excluir o endpoint ${value.name}?`,
            header: 'Excluir Endpoint',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancelar',
            blockScroll: true,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Excluir',
                severity: 'danger'
            },
            accept: () => {
                this.loading.set(true);
                this.loadingEndpoints.update((prev) => ({ ...prev, [value.id]: 'excluindo' }));
                this._endpointsService.excluir(value.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Endpoint excluído com sucesso.', life: 3000 });
                        void this.carregar();
                        this.loadingEndpoints.update((prev) => ({ ...prev, [value.id]: null }));
                        this.loading.set(false);
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao excluir o endpoint.', life: 3000 });
                        console.error(err);
                        this.loadingEndpoints.update((prev) => ({ ...prev, [value.id]: null }));
                        this.loading.set(false);
                    }
                });
            }
        });
    }

    private async carregar() {
        if (this.id !== null) {
            try {
                this.loading.set(true);

                // Load user profile if missing
                if (!this._perfilService.userProfile()) {
                    await lastValueFrom(this._perfilService.getPerfil());
                }
                this.username.set(this._perfilService.userProfile()?.username ?? '');

                // Load Project Details
                const projectData = await lastValueFrom(this._projetosService.obter(this.id));
                this.project.set(projectData);

                // Load Endpoints
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

                // Load Tokens
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

    excluirToken(event: Event, token: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Tem certeza que deseja revogar o token ${token.name}?`,
            header: 'Revogar Token',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Revogar',
                severity: 'danger'
            },
            accept: () => {
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
        });
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
        this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: 'gerando' }));
        try {
            await lastValueFrom(this._endpointsService.generateMock(this.id!, endpointId, count));
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mocks gerados com sucesso.', life: 3000 });
            await this.carregar();
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar os dados mockados.', life: 3000 });
            console.error(err);
        } finally {
            this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: null }));
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
            newLoadingState[item.data.endpoint.id] = 'gerando';
        }
        this.loadingEndpoints.set(newLoadingState);

        for (const item of endpoints) {
            const endpointId = item.data.endpoint.id;

            try {
                // Creates automatically 10 items for each
                await lastValueFrom(this._endpointsService.generateMock(this.id, endpointId, 10));
                // Update local model so UI reflects it immediately
                item.data.endpoint.count = 10;
                // Set only this endpoint to null as it finished
                this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: null }));
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
                resetState[item.data.endpoint.id] = null;
            }
            this.loadingEndpoints.set(resetState);
        } else {
            this.messageService.add({ severity: 'success', summary: 'Concluído', detail: 'Dados mockados gerados para todos os endpoints (10 itens cada).', life: 3000 });
        }

        await this.carregar();
        this.generatingAll.set(false);
    }

    getEndpointURL(value: string): string {
        const username = this.username() || ':username';
        const projectSlug = this.project()?.slug || ':project';
        return `${environment.apiUrl}/${username}/${projectSlug}`;
    }
}
