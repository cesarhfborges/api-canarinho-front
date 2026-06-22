import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics } from '@/app/core/services/dashboard-service';

@Component({
    standalone: true,
    selector: 'app-top-endpoints-widget',
    imports: [CommonModule],
    template: `
        <div class="card h-full">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">Top 5 Endpoints</div>
            </div>

            <div *ngIf="topEndpoints.length === 0" class="text-muted-color text-center py-4">
                Nenhum dado registrado.
            </div>

            <ul class="list-none p-0 m-0">
                <li
                    *ngFor="let endpoint of topEndpoints; let i = index"
                    class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
                >
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0"
                            >/{{ endpoint.endpoint_name }}</span
                        >
                        <div class="mt-1 text-muted-color">ID: {{ endpoint.endpoint_id }}</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div
                            class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24"
                            style="height: 8px"
                        >
                            <div
                                [class]="getBarClass(i)"
                                style="height: 100%;"
                                [style.width]="getPercentage(endpoint.total_hits) + '%'"
                            ></div>
                        </div>
                        <span [class]="getTextClass(i) + ' ml-4 font-medium min-w-[3rem] text-right'">
                            {{ endpoint.total_hits }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    `
})
export class TopEndpointsWidget {
    @Input() metrics: DashboardMetrics | null = null;

    get topEndpoints() {
        return this.metrics?.top_endpoints || [];
    }

    get maxHits() {
        const endpoints = this.topEndpoints;
        if (endpoints.length === 0) return 1;
        return Math.max(...endpoints.map((e) => e.total_hits));
    }

    getPercentage(hits: number): number {
        const max = this.maxHits;
        if (max === 0) return 0;
        return Math.round((hits / max) * 100);
    }

    getBarClass(index: number): string {
        const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500'];
        return colors[index % colors.length];
    }

    getTextClass(index: number): string {
        const colors = ['text-orange-500', 'text-cyan-500', 'text-pink-500', 'text-green-500', 'text-purple-500'];
        return colors[index % colors.length];
    }
}
