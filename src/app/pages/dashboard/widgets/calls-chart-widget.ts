import { afterNextRender, Component, effect, inject, Input, signal, SimpleChanges, OnChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/shared/layout/service/layout.service';
import { DashboardMetrics } from '@/app/core/services/dashboard-service';

@Component({
    standalone: true,
    selector: 'app-calls-chart-widget',
    imports: [ChartModule],
    template: `
        <div class="card mb-8 h-full">
            <div class="font-semibold text-xl mb-4">Requisições (Últimos 7 dias)</div>
            <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-[300px]" />
        </div>
    `
})
export class CallsChartWidget implements OnChanges {
    @Input() metrics: DashboardMetrics | null = null;
    
    layoutService = inject(LayoutService);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    constructor() {
        afterNextRender(() => {
            setTimeout(() => {
                this.initChart();
            }, 150);
        });

        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            setTimeout(() => {
                this.initChart();
            }, 150);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['metrics'] && this.metrics) {
            this.initChart();
        }
    }

    initChart() {
        if (!this.metrics) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const labels = this.metrics.chart_last_7_days.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        const data = this.metrics.chart_last_7_days.map(item => item.hits);

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
