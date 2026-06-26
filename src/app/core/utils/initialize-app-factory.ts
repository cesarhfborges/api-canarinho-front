import { inject } from '@angular/core';
import { finalize, firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SessionService } from '@/app/core/services/session-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { ConfigService } from '@/app/core/services/config-service';
import { ThemeService } from '@/app/core/services/theme-service';
import { LayoutService } from '@/app/shared/layout/service/layout.service';

export async function initializeAppFactory(): Promise<any> {
    const sessionService = inject(SessionService);
    const perfilService = inject(PerfilService);
    const configService = inject(ConfigService);
    const themeService = inject(ThemeService);
    const layoutService = inject(LayoutService);

    try {
        const conf = await firstValueFrom(configService.loadConfig());
        if (conf && conf.theme_preset && conf.theme_primary) {
            themeService.applyThemeConfig({
                preset: conf.theme_preset,
                primary: conf.theme_primary,
                surface: conf.theme_surface
            });
            layoutService.layoutConfig.update((prev) => ({
                ...prev,
                preset: conf.theme_preset || 'Aura',
                primary: conf.theme_primary || 'emerald',
                surface: conf.theme_surface || undefined,
                menuMode: conf.theme_menuMode || prev.menuMode,
                colorScheme: (conf.theme_color_scheme as any) || 'auto'
            }));
        }
    } catch (error) {
        console.error('Failed to load system config', error);
    }

    await firstValueFrom(
        perfilService.getPerfil(true).pipe(
            tap((profile) => {
                sessionService.createSession();
                if (profile && profile.theme_color_scheme) {
                    layoutService.setColorScheme(profile.theme_color_scheme);
                }
            }),
            catchError(() => {
                sessionService.destroySession();
                return of(null);
            }),
            finalize(() => {
                // sessionService.markLoaded();
            })
        )
    );

    return Promise.resolve();
}
