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
}
