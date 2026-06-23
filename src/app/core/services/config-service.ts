import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@/environments/environment';

export interface SystemConfig {
    allow_register?: boolean;
    rate_limit_requests?: number;
    rate_limit_time?: number;
    theme_preset?: string;
    theme_primary?: string;
    theme_surface?: string | null;
    theme_menuMode?: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public config = signal<SystemConfig>({});
    private readonly http = inject(HttpClient);

    public loadConfig(): Observable<SystemConfig> {
        return this.http
            .get<SystemConfig>(`${environment.apiUrl}/system/config`)
            .pipe(tap((data) => this.config.set(data)));
    }

    public updateConfig(data: SystemConfig): Observable<any> {
        return this.http
            .put(`${environment.apiUrl}/admin/config`, data)
            .pipe(tap(() => {
                this.config.update(current => ({ ...current, ...data }));
            }));
    }

    public clearCache(): Observable<any> {
        return this.http.post(`${environment.apiUrl}/admin/cache/clear`, {});
    }
}
