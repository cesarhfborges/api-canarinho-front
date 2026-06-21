import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RegrasService {
    private readonly http = inject(HttpClient);

    public listar(endpointId: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/admin/endpoints/${endpointId}/rules`);
    }

    public criar(endpointId: number, data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/endpoints/${endpointId}/rules`, data);
    }

    public atualizar(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/admin/rules/${id}`, data);
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/admin/rules/${id}`);
    }
}
