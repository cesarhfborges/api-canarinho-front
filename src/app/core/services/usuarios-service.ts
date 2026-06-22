import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { UserProfile } from './perfil-service';

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    total: number;
    per_page: number;
}

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private readonly http = inject(HttpClient);

    public listar(params: any = {}): Observable<PaginatedResponse<UserProfile>> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach((key) => {
            if (params[key] !== null && params[key] !== undefined) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        return this.http.get<PaginatedResponse<UserProfile>>(`${environment.apiUrl}/admin/users`, { params: httpParams });
    }

    public obter(id: number): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${environment.apiUrl}/admin/users/${id}`);
    }

    public criar(data: any): Observable<UserProfile> {
        return this.http.post<UserProfile>(`${environment.apiUrl}/admin/users`, data);
    }

    public atualizar(id: number, data: any): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${environment.apiUrl}/admin/users/${id}`, data);
    }

    public excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/admin/users/${id}`);
    }

    public atualizarSenha(id: number, data: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/users/${id}/password`, data);
    }
}
