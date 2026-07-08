import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { environment } from '@/environments/environment';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-endpoint-visualizar',
    imports: [TableModule, ButtonModule, JsonPipe],
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
    private readonly http = inject(HttpClient);
    private readonly messageService = inject(MessageService);

    ngOnInit(): void {
        // Inicialização é feita pelo onLazyLoad da tabela se for lazy, mas caso a tabela dispare logo:
        // this.carregarDados();
    }

    async carregarDados(event?: any) {
        this.loading.set(true);

        const username = this.dialogConfig.data?.username;
        const projectSlug = this.dialogConfig.data?.projectSlug;
        const endpointName = this.dialogConfig.data?.endpoint?.fullPath || this.dialogConfig.data?.endpoint?.name;
        const token = this.dialogConfig.data?.token;

        if (!username || !projectSlug || !endpointName || !token) {
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

        let url = `${environment.apiUrl}/mock/${username}/${projectSlug}/${endpointName}?page=${page}&per_page=${perPage}`;

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
                }

                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao buscar os dados da API.',
                    life: 3000
                });
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
