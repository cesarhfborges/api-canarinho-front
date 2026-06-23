import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfigService } from '@/app/core/services/config-service';
import { ThemeService } from '@/app/core/services/theme-service';
import { LayoutService } from '@/app/shared/layout/service/layout.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-configuracoes',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputNumberModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        RippleModule,
        SelectButtonModule,
        SelectModule,
        TooltipModule
    ],
    templateUrl: './configuracoes.html'
})
export class Configuracoes implements OnInit {
    private fb = inject(NonNullableFormBuilder);
    private configService = inject(ConfigService);
    public themeService = inject(ThemeService);
    public layoutService = inject(LayoutService);
    private messageService = inject(MessageService);

    public isLoading = signal<boolean>(false);
    public isClearingCache = signal<boolean>(false);

    public presets = ['Aura', 'Lara', 'Nora'];
    public menuModeOptions = [
        { label: 'Estático', value: 'static' },
        { label: 'Sobreposto', value: 'overlay' }
    ];

    public colorSchemeOptions = [
        { label: 'Sistema (Auto)', value: 'auto' },
        { label: 'Claro', value: 'light' },
        { label: 'Escuro', value: 'dark' }
    ];

    public configForm = this.fb.group({
        allow_register: [false],
        rate_limit_requests: [2000],
        rate_limit_time: [60],
        theme_preset: ['Aura'],
        theme_primary: ['emerald'],
        theme_surface: [''],
        theme_menuMode: ['static'],
        theme_color_scheme: ['auto']
    });

    public selectedPrimaryColor = signal<string>('emerald');
    public selectedSurfaceColor = signal<string | null>('');
    public selectedPreset = signal<string>('Aura');

    public get primaryColorsList() {
        return this.themeService.getPrimaryColors(this.configForm.value.theme_preset || 'Aura');
    }

    public get surfacesList() {
        return this.themeService.surfaces;
    }

    ngOnInit() {
        const currentConfig = this.configService.config();
        
        let allowRegister = currentConfig.allow_register;
        if (typeof allowRegister === 'string') {
            allowRegister = allowRegister === 'true' || allowRegister === '1';
        }

        this.configForm.patchValue({
            allow_register: Boolean(allowRegister),
            rate_limit_requests: Number(currentConfig.rate_limit_requests) || 2000,
            rate_limit_time: Number(currentConfig.rate_limit_time) || 60,
            theme_preset: currentConfig.theme_preset || 'Aura',
            theme_primary: currentConfig.theme_primary || 'emerald',
            theme_surface: currentConfig.theme_surface || '',
            theme_menuMode: currentConfig.theme_menuMode || 'static',
            theme_color_scheme: currentConfig.theme_color_scheme || 'auto'
        });

        this.selectedPreset.set(currentConfig.theme_preset || 'Aura');
        this.selectedPrimaryColor.set(currentConfig.theme_primary || 'emerald');
        this.selectedSurfaceColor.set(currentConfig.theme_surface || '');

        this.configForm.valueChanges.subscribe(val => {
            this.selectedPreset.set(val.theme_preset || 'Aura');
            this.selectedPrimaryColor.set(val.theme_primary || 'emerald');
            this.selectedSurfaceColor.set(val.theme_surface || '');

            if (val.theme_preset && val.theme_primary) {
                this.themeService.applyThemeConfig({
                    preset: val.theme_preset,
                    primary: val.theme_primary,
                    surface: val.theme_surface
                });
                if (val.theme_menuMode) {
                    this.layoutService.layoutConfig.update((prev) => ({ ...prev, menuMode: val.theme_menuMode as string }));
                }
            }
        });
    }

    public onSubmit() {
        this.isLoading.set(true);
        const data = this.configForm.getRawValue();

        this.configService.updateConfig(data).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Configurações salvas com sucesso!'
                });
            },
            error: () => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar as configurações.'
                });
            }
        });
    }

    public clearCache() {
        this.isClearingCache.set(true);
        this.configService.clearCache().subscribe({
            next: () => {
                this.isClearingCache.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cache do sistema limpo com sucesso!'
                });
            },
            error: () => {
                this.isClearingCache.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao limpar cache.'
                });
            }
        });
    }
}
