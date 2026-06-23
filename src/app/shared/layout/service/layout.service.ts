import { Injectable, effect, signal, computed } from '@angular/core';

export interface LayoutConfig {
    preset: string;
    primary: string;
    surface: string | undefined | null;
    colorScheme: 'light' | 'dark' | 'auto';
    menuMode: string;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    configSidebarVisible: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    layoutConfig = signal<LayoutConfig>({
        preset: 'Aura',
        primary: 'emerald',
        surface: null,
        colorScheme: 'auto',
        menuMode: 'static'
    });

    systemDarkTheme = signal<boolean>(false);

    layoutState = signal<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        mobileMenuActive: false,
        menuHoverActive: false,
        activePath: null
    });

    theme = computed(() => (this.isDarkTheme() ? 'dark' : 'light'));

    isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().mobileMenuActive);

    isDarkTheme = computed(() => {
        const scheme = this.layoutConfig().colorScheme;
        if (scheme === 'dark') return true;
        if (scheme === 'light') return false;
        return this.systemDarkTheme();
    });

    getPrimary = computed(() => this.layoutConfig().primary);

    getSurface = computed(() => this.layoutConfig().surface);

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    private initialized = false;

    constructor() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemDarkTheme.set(mediaQuery.matches);
        mediaQuery.addEventListener('change', (e) => {
            this.systemDarkTheme.set(e.matches);
            if (this.layoutConfig().colorScheme === 'auto') {
                this.handleDarkModeTransition(this.layoutConfig());
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });
    }

    private handleDarkModeTransition(config: LayoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
        }
    }

    private startViewTransition(config: LayoutConfig): void {
        document.startViewTransition(() => {
            this.toggleDarkMode(config);
        });
    }

    setColorScheme(scheme: 'light' | 'dark' | 'auto'): void {
        this.layoutConfig.update((state) => ({ ...state, colorScheme: scheme }));
    }

    private toggleDarkMode(config?: LayoutConfig): void {
        const _config = config || this.layoutConfig();
        const isDark = _config.colorScheme === 'dark' || (_config.colorScheme === 'auto' && this.systemDarkTheme());
        if (isDark) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    onMenuToggle(): void {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !this.layoutState().overlayMenuActive }));
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
        } else {
            this.layoutState.update((prev) => ({ ...prev, mobileMenuActive: !this.layoutState().mobileMenuActive }));
        }
    }

    showConfigSidebar(): void {
        this.layoutState.update((prev) => ({ ...prev, configSidebarVisible: true }));
    }

    hideConfigSidebar(): void {
        this.layoutState.update((prev) => ({ ...prev, configSidebarVisible: false }));
    }

    isDesktop(): boolean {
        return window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }
}
