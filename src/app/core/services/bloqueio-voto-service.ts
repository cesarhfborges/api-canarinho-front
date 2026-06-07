import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';
import { BloqueioVoto } from '@/app/core/models/bloqueio-voto';
import { buildHttpParams, HttpOptions } from '@/app/core/utils/http.utils';

@Injectable({
    providedIn: 'root'
})
export class BloqueioVotoService {
    private readonly http = inject(HttpClient);

    public listar(reuniaoId: number, pautaId: number, options?: HttpOptions): Observable<BloqueioVoto[]> {
        const params = buildHttpParams(options);
        return this.http.get<BloqueioVoto[]>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/bloqueios-voto`, { params });
    }

    public get(reuniaoId: number, pautaId: number): Observable<BloqueioVoto> {
        return this.http.get<BloqueioVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/bloqueios-voto`);
    }

    public create(reuniaoId: number, pautaId: number, data: any): Observable<BloqueioVoto> {
        return this.http.post<BloqueioVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/bloqueios-voto`, data);
    }

    public update(reuniaoId: number, pautaId: number, id: number, data: any): Observable<BloqueioVoto> {
        return this.http.post<BloqueioVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/bloqueios-voto/${id}`, data);
    }

    public excluir(reuniaoId: number, pautaId: number, id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/bloqueios-voto/${id}`);
    }
}
