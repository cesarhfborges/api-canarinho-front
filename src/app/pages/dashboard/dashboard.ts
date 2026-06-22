import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsWidget } from './widgets/dashboard-stats-widget';
import { TopEndpointsWidget } from './widgets/top-endpoints-widget';
import { CallsChartWidget } from './widgets/calls-chart-widget';
import { DashboardService, DashboardMetrics } from '@/app/core/services/dashboard-service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, DashboardStatsWidget, TopEndpointsWidget, CallsChartWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-dashboard-stats-widget class="contents" [metrics]="metrics()" />
            <div class="col-span-12 xl:col-span-6">
                <app-top-endpoints-widget [metrics]="metrics()" />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-calls-chart-widget [metrics]="metrics()" />
            </div>
        </div>
    `
})
export class Dashboard implements OnInit {
    private dashboardService = inject(DashboardService);

    metrics = signal<DashboardMetrics | null>(null);

    ngOnInit(): void {
        this.dashboardService.getMetrics().subscribe({
            next: (data) => {
                this.metrics.set(data);
            },
            error: (err) => {
                console.error('Erro ao carregar métricas', err);
            }
        });
    }
}
