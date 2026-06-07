import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Funcionario } from '@/app/core/models/Funcionario';
import { buildHttpParams, HttpOptions } from '@/app/core/utils/http.utils';

@Injectable({
    providedIn: 'root'
})
export class FuncionariosService {
    private readonly http = inject(HttpClient);

    public listar(options?: HttpOptions): Observable<Funcionario[]> {
        const params = buildHttpParams(options);

        return this.http.get<Funcionario[]>(`${environment.apiUrl}/funcionarios`, { params });
    }
}
