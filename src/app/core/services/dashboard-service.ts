import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface TopEndpoint {
    endpoint_id: number;
    endpoint_name: string;
    total_hits: number;
}

export interface ChartDailyHit {
    date: string;
    hits: number;
}

export interface DashboardMetrics {
    total_projects: number;
    total_endpoints: number;
    total_calls: number;
    calls_today: number;
    error_rate_percentage: number;
    top_endpoints: TopEndpoint[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly http = inject(HttpClient);

    public getMetrics(): Observable<DashboardMetrics> {
        return this.http.get<DashboardMetrics>(`${environment.apiUrl}/admin/dashboard/metrics`);
    }

    public getChartData(start: string, end: string, groupby: string): Observable<ChartDailyHit[]> {
        return this.http.get<ChartDailyHit[]>(`${environment.apiUrl}/admin/dashboard/chart`, {
            params: { start, end, groupby }
        });
    }
}
