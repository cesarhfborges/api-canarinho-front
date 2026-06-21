import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TokensService {
    private readonly http = inject(HttpClient);

    public listar(projectId: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/admin/projects/${projectId}/tokens`);
    }

    public criar(projectId: number, data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/projects/${projectId}/tokens`, data);
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/admin/tokens/${id}`);
    }
}
