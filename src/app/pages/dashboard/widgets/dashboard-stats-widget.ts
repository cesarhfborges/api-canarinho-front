import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics } from '@/app/core/services/dashboard-service';

@Component({
    standalone: true,
    selector: 'app-dashboard-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Projetos Ativos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ metrics?.total_projects || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-folder text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Cadastrados </span>
                <span class="text-muted-color">em sua conta</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Endpoints Mocks</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ metrics?.total_endpoints || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-bolt text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">APIs </span>
                <span class="text-muted-color">configuradas</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Requisições (Total)</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ metrics?.total_calls || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-server text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+{{ metrics?.calls_today || 0 }} </span>
                <span class="text-muted-color">recebidas hoje</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Taxa de Erro</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ metrics?.error_rate_percentage || 0 }}%</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-exclamation-circle text-purple-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Respostas </span>
                <span class="text-muted-color">4xx / 5xx</span>
            </div>
        </div>
    `
})
export class DashboardStatsWidget {
    @Input() metrics: DashboardMetrics | null = null;
}
