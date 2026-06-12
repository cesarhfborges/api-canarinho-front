import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Pauta } from '@/app/core/models/pauta';

@Injectable({
    providedIn: 'root'
})
export class PautaService {
    private readonly http = inject(HttpClient);

    public listar(reuniaoId: number): Observable<Pauta[]> {
        return this.http.get<Pauta[]>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas`);
    }

    public get(reuniaoId: number, id: number): Observable<Pauta> {
        return this.http.get<Pauta>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${id}`);
    }

    public update(reuniaoId: number, id: number, data: any): Observable<Pauta> {
        return this.http.put<Pauta>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${id}`, data);
    }

    public create(reuniaoId: number, data: any): Observable<Pauta> {
        return this.http.post<Pauta>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas`, data);
    }

    public excluir(reuniaoId: number, id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${id}`);
    }
}
