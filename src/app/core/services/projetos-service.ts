import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProjetosService {
    private readonly http = inject(HttpClient);

    public listar(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/admin/projects`);
    }

    public obter(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/admin/projects/${id}`);
    }

    public criar(data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/projects`, data);
    }

    public atualizar(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/admin/projects/${id}`, data);
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/admin/projects/${id}`);
    }
}
