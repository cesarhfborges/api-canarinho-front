import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Reuniao } from '@/app/core/models/reuniao';

@Injectable({
    providedIn: 'root'
})
export class ReuniaoService {
    private readonly http = inject(HttpClient);

    public listar(): Observable<Reuniao[]> {
        return this.http.get<Reuniao[]>(`${environment.apiUrl}/reunioes`);
    }

    public get(id: number): Observable<Reuniao> {
        return this.http.get<Reuniao>(`${environment.apiUrl}/reunioes/${id}`);
    }
}
