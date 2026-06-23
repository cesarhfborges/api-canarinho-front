import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateLimitData } from '@/app/core/services/dashboard-service';

@Component({
    standalone: true,
    selector: 'app-rate-limit-widget',
    imports: [CommonModule],
    template: `
        <div class="card h-full">
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Rate Limit</div>
                <span class="text-sm text-muted-color">
                    Últimos {{ rateLimit?.time_window_minutes }} min
                </span>
            </div>

            <div *ngIf="!rateLimit" class="text-muted-color text-center py-4">
                Carregando dados...
            </div>

            <div *ngIf="rateLimit" class="flex flex-col justify-center h-[calc(100%-3rem)]">
                <div class="flex justify-between mb-2">
                    <span class="text-surface-900 dark:text-surface-0 font-medium">Uso Atual</span>
                    <span class="text-muted-color">{{ rateLimit.current_usage }} / {{ rateLimit.limit }}</span>
                </div>

                <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden h-4 mb-3">
                    <div
                        [class]="progressBarClass()"
                        class="h-full transition-all duration-500 ease-in-out"
                        [style.width]="usagePercentage() + '%'"
                    ></div>
                </div>
                
                <div class="flex justify-between text-sm">
                    <span class="text-muted-color">Disponível: <span class="font-medium text-surface-900 dark:text-surface-0">{{ rateLimit.remaining }}</span></span>
                    <span [class]="percentageClass() + ' font-medium'">{{ usagePercentage() }}%</span>
                </div>
            </div>
        </div>
    `
})
export class RateLimitWidget {
    @Input() rateLimit: RateLimitData | null = null;

    usagePercentage = computed(() => {
        if (!this.rateLimit) return 0;
        if (this.rateLimit.limit === 0) return 0;
        const percentage = (this.rateLimit.current_usage / this.rateLimit.limit) * 100;
        return Math.min(Math.round(percentage), 100);
    });

    progressBarClass = computed(() => {
        const percentage = this.usagePercentage();
        if (percentage < 50) return 'bg-green-500';
        if (percentage < 80) return 'bg-orange-500';
        return 'bg-red-500';
    });

    percentageClass = computed(() => {
        const percentage = this.usagePercentage();
        if (percentage < 50) return 'text-green-500';
        if (percentage < 80) return 'text-orange-500';
        return 'text-red-500';
    });
}
