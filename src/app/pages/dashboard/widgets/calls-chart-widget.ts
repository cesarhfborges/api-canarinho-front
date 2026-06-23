import { afterNextRender, Component, effect, inject, signal, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@/app/shared/layout/service/layout.service';
import { DashboardService } from '@/app/core/services/dashboard-service';

@Component({
    standalone: true,
    selector: 'app-calls-chart-widget',
    imports: [ChartModule, SelectModule, FormsModule],
    template: `
        <div class="card mb-8 h-full">
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Histórico de Requisições</div>
                <p-select [options]="filterOptions" [(ngModel)]="selectedFilter" (onChange)="onFilterChange()" optionLabel="label" optionValue="value" class="w-48" />
            </div>
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-[300px]" />
        </div>
    `
})
export class CallsChartWidget implements OnInit {
    dashboardService = inject(DashboardService);
    layoutService = inject(LayoutService);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    filterOptions = [
        { label: 'Últimas 6 horas', value: 'hour' },
        { label: 'Últimos 7 dias', value: 'day' }
    ];
    selectedFilter = 'hour';

    constructor() {
        effect(() => {
            this.layoutService.isDarkTheme();
            if (this.chartData()) {
                this.initChart(this.chartData()); // re-apply theme options
            }
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    onFilterChange() {
        this.loadData();
    }

    loadData() {
        const now = new Date();
        const end = this.formatDateTime(now);
        
        let startObj = new Date();
        if (this.selectedFilter === 'hour') {
            startObj.setHours(startObj.getHours() - 6);
        } else {
            startObj.setDate(startObj.getDate() - 6);
        }
        const start = this.formatDateTime(startObj);

        this.dashboardService.getChartData(start, end, this.selectedFilter).subscribe({
            next: (data) => {
                this.initChart(data);
            },
            error: (err) => console.error('Erro ao carregar dados do gráfico', err)
        });
    }

    private formatDateTime(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    initChart(apiData: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const labels = apiData.map(item => {
            const dateObj = new Date(item.date);
            if (this.selectedFilter === 'hour') {
                return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            }
            return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        const data = apiData.map(item => item.hits);

        this.chartData.set({
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Total de Chamadas',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: data,
                    borderRadius: 8,
                    barThickness: 32
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    ticks: {
                        color: textMutedColor,
                        stepSize: 1
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        });
    }
}
