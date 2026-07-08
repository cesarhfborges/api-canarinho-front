import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '@/environments/environment';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

export interface PathSegment {
    type: 'text' | 'param';
    value: string;
}

@Component({
    selector: 'app-endpoint-visualizar',
    imports: [TableModule, ButtonModule, JsonPipe, FormsModule, InputTextModule],
    templateUrl: './endpoint-visualizar.html',
    styleUrl: './endpoint-visualizar.scss'
})
export class EndpointVisualizar implements OnInit {
    public readonly dialogConfig = inject(DynamicDialogConfig);
    public readonly dialogRef = inject(DynamicDialogRef);
    loading = signal<boolean>(false);
    data = signal<any[]>([]);
    columns = signal<{ field: string; header: string }[]>([]);
    totalRecords = signal<number>(0);
    requestUrl = signal<string>('');
    
    pathSegments = signal<PathSegment[]>([]);
    username = signal<string>('');
    projectSlug = signal<string>('');
    apiUrl = environment.apiUrl;

    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);

    ngOnInit(): void {
        this.username.set(this.dialogConfig.data?.username || '');
        this.projectSlug.set(this.dialogConfig.data?.projectSlug || '');

        const endpointName: string = this.dialogConfig.data?.endpoint?.fullPath || this.dialogConfig.data?.endpoint?.name || '';
        
        const segments: PathSegment[] = [];
        const parts = endpointName.split('/');
        for (const part of parts) {
            if (part === '') continue;
            if (part.startsWith(':')) {
                segments.push({ type: 'param', value: '1' });
            } else {
                segments.push({ type: 'text', value: part });
            }
        }
        this.pathSegments.set(segments);
    }

    getBuiltPath(): string {
        return this.pathSegments().map(s => s.value).join('/');
    }

    refreshUrl() {
        this.carregarDados();
    }

    async carregarDados(event?: any) {
        this.loading.set(true);

        const username = this.username();
        const projectSlug = this.projectSlug();
        const token = this.dialogConfig.data?.token;

        if (!username || !projectSlug || !token) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Faltam parâmetros para carregar os dados.',
                life: 3000
            });
            this.loading.set(false);
            return;
        }

        const page = event ? event.first / event.rows + 1 : 1;
        const perPage = event ? event.rows : 10;

        const path = this.getBuiltPath();

        let url = `${this.apiUrl}/mock/${username}/${projectSlug}/${path}?page=${page}&per_page=${perPage}`;

        // Sorting
        if (event?.sortField) {
            url += `&sort_by=${event.sortField}&sort_order=${event.sortOrder === 1 ? 'asc' : 'desc'}`;
        }

        this.requestUrl.set(url);

        const headers = new HttpHeaders({
            Application: 'web',
            'X-Origin': window.location.origin,
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        });

        this.http.get<any>(url, { headers }).subscribe({
            next: (res) => {
                let items: any[] = [];
                // Check if it's paginated or direct array
                if (Array.isArray(res)) {
                    items = res;
                    this.totalRecords.set(res.length);
                } else if (res && Array.isArray(res.data)) {
                    items = res.data;
                    this.totalRecords.set(res.total ?? res.data.length);
                } else {
                    // Singular object or unrecognized format
                    items = [res];
                    this.totalRecords.set(1);
                }

                this.data.set(items);

                if (items.length > 0) {
                    const firstItem = items[0];
                    const cols = Object.keys(firstItem).map((key) => ({
                        field: key,
                        header: key
                    }));
                    // Sort cols to put 'id' first if it exists
                    cols.sort((a, b) => {
                        if (a.field === 'id') return -1;
                        if (b.field === 'id') return 1;
                        return 0;
                    });
                    this.columns.set(cols);
                } else {
                    this.columns.set([]);
                }

                this.loading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error(err);
                
                this.data.set([]);
                this.columns.set([]);
                this.totalRecords.set(0);

                if (err.status === 404 && err.error?.error?.includes('Parent mock record not found')) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: 'O registro pai selecionado não existe. Verifique o ID ou gere os dados do endpoint pai primeiro.',
                        life: 5000
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Falha ao buscar os dados da API.',
                        life: 3000
                    });
                }
                this.loading.set(false);
            }
        });
    }

    fechar() {
        this.dialogRef.close();
    }

    isObject(val: any): boolean {
        return val !== null && typeof val === 'object';
    }
}
