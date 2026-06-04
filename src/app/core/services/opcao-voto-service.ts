import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { OpcaoVoto } from '@/app/core/models/opcao-voto';
import { ReordenarOpcaoVoto } from '@/app/core/models/reordenar-opcao-voto';

@Injectable({
    providedIn: 'root'
})
export class OpcaoVotoService {
    private readonly http = inject(HttpClient);

    public listar(reuniaoId: number, pautaId: number): Observable<OpcaoVoto[]> {
        return this.http.get<OpcaoVoto[]>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes`);
    }

    public get(reuniaoId: number, pautaId: number, id: number): Observable<OpcaoVoto> {
        return this.http.get<OpcaoVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes/${id}`);
    }

    public update(reuniaoId: number, pautaId: number, id: number, data: any): Observable<OpcaoVoto> {
        return this.http.put<OpcaoVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes/${id}`, data);
    }

    public create(reuniaoId: number, pautaId: number, data: any): Observable<OpcaoVoto> {
        return this.http.post<OpcaoVoto>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes`, data);
    }

    public excluir(reuniaoId: number, pautaId: number, id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes/${id}`);
    }

    public reordenar(reuniaoId: number, pautaId: number, data: ReordenarOpcaoVoto[]): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/opcoes/reordenar`, data);
    }
}
