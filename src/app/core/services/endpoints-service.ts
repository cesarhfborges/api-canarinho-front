import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Resource } from '@/app/core/models/resource';

@Injectable({
    providedIn: 'root'
})
export class EndpointsService {
    private readonly http = inject(HttpClient);

    public listar(projetoId: number): Observable<Resource[]> {
        return this.http.get<Resource[]>(`${environment.apiUrl}/admin/projects/${projetoId}/endpoints`);
    }

    public generateMock(projetoId: number, endpointId: number, count: number): Observable<Resource[]> {
        return this.http.post<Resource[]>(
            `${environment.apiUrl}/admin/projects/${projetoId}/endpoints/${endpointId}/generate`,
            {
                count: count
            }
        );
    }
}
