import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VotacaoService {
    private readonly http = inject(HttpClient);

    public abrirVotacao(reuniaoId: number, pautaId: number, data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/votacao/abrir`, data);
    }

    public fecharVotacao(reuniaoId: number, pautaId: number): Observable<any> {
        return this.http.post<any>(
            `${environment.apiUrl}/reunioes/${reuniaoId}/pautas/${pautaId}/votacao/encerrar`,
            {}
        );
    }
}
