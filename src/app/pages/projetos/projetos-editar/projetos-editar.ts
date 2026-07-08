import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';

import { TooltipModule } from 'primeng/tooltip';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { TokensService } from '@/app/core/services/tokens.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { SliderModule, SliderSlideEndEvent } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { environment } from '@/environments/environment';
import {
    EndpointVisualizar
} from '@/app/pages/projetos/projetos-editar/components/endpoint-visualizar/endpoint-visualizar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FORBIDDEN_HEADERS } from '@/app/core/utils/forbidden-headers';

@Component({
    selector: 'app-projetos-editar',
    imports: [
        CardModule,
        ButtonModule,

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
        NgClass,
        ToggleSwitchModule,
        NgTemplateOutlet
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
    projectHeaders = signal<any[]>([]);
    username = signal<string>('');

    public readonly _dialogService = inject(DialogService);
    public readonly id: number | null = null;
    generatingAll = signal<boolean>(false);
    clonedHeaders: { [s: string]: any } = {};
    editingRows: { [s: string]: boolean } = {};
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly _endpointsService = inject(EndpointsService);
    private readonly _tokensService = inject(TokensService);
    private readonly _projetosService = inject(ProjetosService);
    private readonly _perfilService = inject(PerfilService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

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

    onTabChange(_event: any): void {
        // Clear token visibility when switching tabs
        this.visibleTokens.set({});
    }

    ngOnInit(): void {
        void this.carregar();
    }

    editar(value: any) {
        if (value) {
            this.router.navigate(['/projetos', this.id, 'endpoint', value.id]);
        } else {
            this.router.navigate(['/projetos', this.id, 'endpoint', 'add']);
        }
    }

    visualizarDados(value: any) {
        // Validate if there is a token available
        if (this.tokens().length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Você precisa gerar ao menos um Token na aba de Tokens antes de pré-visualizar os dados.',
                life: 5000
            });
            return;
        }

        console.log(value);

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
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Endpoint excluído com sucesso.',
                            life: 3000
                        });
                        void this.carregar();
                        this.loadingEndpoints.update((prev) => ({ ...prev, [value.id]: null }));
                        this.loading.set(false);
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Ocorreu um erro ao excluir o endpoint.',
                            life: 3000
                        });
                        console.error(err);
                        this.loadingEndpoints.update((prev) => ({ ...prev, [value.id]: null }));
                        this.loading.set(false);
                    }
                });
            }
        });
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Token gerado com sucesso.',
                    life: 3000
                });
                this.showTokenDialog.set(false);
                void this.carregar();
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível gerar o token.',
                    life: 3000
                });
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
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Token revogado.',
                            life: 3000
                        });
                        void this.carregar();
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao revogar o token.',
                            life: 3000
                        });
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

    adicionarFilho(parentEndpoint: any) {
        this.router.navigate(['/projetos', this.id, 'endpoint', 'add'], {
            queryParams: { parentId: parentEndpoint.id }
        });
    }

    async gerarTodos() {
        if (this.id === null) return;

        const endpoints = this.getAllNodes(this.files());
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
                // Creates automatically based on generation_count or defaults to 10
                const genCount = item.data.endpoint.generation_count > 0 ? item.data.endpoint.generation_count : 10;

                await lastValueFrom(this._endpointsService.generateMock(this.id, item.data.endpoint.id, genCount));
                // Update local model so UI reflects it immediately
                item.data.endpoint.generation_count = genCount;
                // Set only this endpoint to null as it finished
                this.loadingEndpoints.update((prev) => ({ ...prev, [endpointId]: null }));
            } catch (err) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: `Falha ao gerar dados para ${item.label}`,
                    life: 3000
                });
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
            this.messageService.add({
                severity: 'success',
                summary: 'Concluído',
                detail: 'Dados mockados gerados para todos os endpoints de acordo com a quantidade definida (ou 10 por padrão).',
                life: 3000
            });
            await this.carregar();
        }

        await this.carregar();
        this.generatingAll.set(false);
    }

    getEndpointURL(_value: string): string {
        const username = this.username() || ':username';
        const projectSlug = this.project()?.slug || ':project';
        return `${environment.apiUrl}/mock/${username}/${projectSlug}`;
    }

    adicionarHeader() {
        const headers = [...this.projectHeaders()];
        const newId = crypto.randomUUID();
        const newHeader = { _id: newId, key: '', value: '', active: true };
        headers.push(newHeader);
        this.projectHeaders.set(headers);

        this.clonedHeaders[newId] = { ...newHeader };
        this.editingRows[newId] = true;
    }

    excluirHeader(index: number) {
        const headers = [...this.projectHeaders()];
        headers.splice(index, 1);
        this.projectHeaders.set(headers);
        this.salvarHeaders();
        this.messageService.add({ severity: 'success', summary: 'Excluída', detail: 'Header removida com sucesso.' });
    }

    onRowEditInit(header: any) {
        this.clonedHeaders[header._id] = { ...header };
        this.editingRows[header._id] = true;
    }

    onRowEditSave(header: any, index: number) {
        const key = header.key?.trim() || '';

        if (!key) {
            this.messageService.add({
                severity: 'error',
                summary: 'Header inválida',
                detail: 'A chave da header não pode ser vazia.'
            });
            return;
        }

        const headerRegex = /^[a-zA-Z0-9-]+$/;
        if (!headerRegex.test(key)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Header inválida',
                detail: 'A chave deve conter apenas letras, números e hifens (sem espaços).'
            });
            return;
        }

        if (FORBIDDEN_HEADERS.includes(key.toLowerCase())) {
            this.messageService.add({
                severity: 'error',
                summary: 'Header não permitida',
                detail: 'Esta header é privativa do sistema e não pode ser configurada manualmente.'
            });
            return;
        }

        delete this.clonedHeaders[header._id];
        delete this.editingRows[header._id];

        const headers = [...this.projectHeaders()];
        headers[index] = header;
        this.projectHeaders.set(headers);
        this.salvarHeaders();
        this.messageService.add({ severity: 'success', summary: 'Salva', detail: 'Header configurada com sucesso.' });
    }

    onRowEditCancel(header: any, index: number) {
        const headers = [...this.projectHeaders()];
        const cloned = this.clonedHeaders[header._id];

        if (cloned && cloned.key === '' && cloned.value === '') {
            // Se era uma nova header (em branco) e cancelou, removemos da lista
            headers.splice(index, 1);
        } else {
            headers[index] = cloned;
        }

        delete this.clonedHeaders[header._id];
        delete this.editingRows[header._id];
        this.projectHeaders.set(headers);
    }

    salvarHeaders() {
        if (!this.id) return;
        this._projetosService.atualizar(this.id, { custom_headers: this.projectHeaders() }).subscribe({
            next: (res) => {
                this.project.set(res);
                this.projectHeaders.set(
                    (res.custom_headers || []).map((h: any) => (h._id ? h : { ...h, _id: crypto.randomUUID() }))
                );
            },
            error: (_err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar headers.' });
            }
        });
    }

    protected async gerarDadosMock($event: SliderSlideEndEvent, data: any): Promise<void> {
        if ($event.value === undefined) {
            return;
        }

        if (this.id === null) return;

        this.loadingEndpoints.update((prev) => ({ ...prev, [data.endpoint.id]: 'gerando' }));

        try {
            await lastValueFrom(
                this._endpointsService.generateMock(this.id, data.endpoint.id, data.endpoint.generation_count)
            );
            await this.carregar();
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados mockados gerados.',
                life: 3000
            });
        } catch (err) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao gerar os dados mockados.',
                life: 3000
            });
            console.error(err);
        } finally {
            this.loadingEndpoints.update((prev) => ({ ...prev, [data.endpoint.id]: null }));
        }
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
                this.projectHeaders.set(
                    (projectData.custom_headers || []).map((h: any) => (h._id ? h : { ...h, _id: crypto.randomUUID() }))
                );

                // Load Endpoints
                const endpoints = await this.getEndpoints(this.id);
                this.files.set(this.buildEndpointTree(endpoints));

                // Load Tokens
                const loadedTokens = await lastValueFrom(this._tokensService.listar(this.id));
                this.tokens.set(loadedTokens);
            } catch (err) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar os dados do projeto.',
                    life: 3000
                });
                console.error(err);
            } finally {
                this.loading.set(false);
            }
        }
    }

    private buildEndpointTree(endpoints: any[]): TreeNode[] {
        const map = new Map<number, any>();
        const roots: any[] = [];

        endpoints.forEach((e) => {
            map.set(e.id, { ...e, children: [] });
        });

        endpoints.forEach((e) => {
            const ep = map.get(e.id);
            if (ep.parent_id) {
                const parent = map.get(ep.parent_id);
                if (parent) {
                    parent.children.push(ep);
                    ep.generation_count = parent.count > 0 ? Math.round((ep.count || 0) / parent.count) : ep.count || 0;
                } else {
                    ep.generation_count = ep.count || 0;
                }
            } else {
                ep.generation_count = ep.count || 0;
                roots.push(ep);
            }
        });

        const setPath = (ep: any, currentPath: string) => {
            ep.fullPath = currentPath ? `${currentPath}/:parentId/${ep.name}` : ep.name;
            if (ep.children) {
                ep.children.forEach((child: any) => setPath(child, ep.fullPath));
            }
        };
        roots.forEach(root => setPath(root, ''));

        const convertToTreeNode = (ep: any): TreeNode => {
            return {
                key: ep.id.toString(),
                label: ep.name,
                data: { endpoint: ep },
                children: ep.children ? ep.children.map(convertToTreeNode) : [],
                expanded: true
            };
        };

        return roots.map(convertToTreeNode);
    }

    private getAllNodes(nodes: TreeNode[]): TreeNode[] {
        let all: TreeNode[] = [];
        for (const node of nodes) {
            all.push(node);
            if (node.children) {
                all = all.concat(this.getAllNodes(node.children));
            }
        }
        return all;
    }
}
