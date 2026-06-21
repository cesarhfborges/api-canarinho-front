import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '@/app/shared/layout/service/layout.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, BreadcrumbModule],
    template: `<div class="layout-wrapper" [ngClass]="containerClass()">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                @if (showBreadCrumb) {
                    <p-breadcrumb [model]="items" [home]="home" styleClass="rounded-xl" />
                }
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask"></div>
    </div> `
})
export class AppLayout implements OnInit {
    showBreadCrumb = false;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    layoutService = inject(LayoutService);
    route = inject(ActivatedRoute);

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    ngOnInit() {
        this.items = [
            { label: 'Projetos', disabled: true },
            {
                label: 'Novo Projeto',
                icon: 'pi pi-plus-circle text-white!',
                iconClass: 'text-white',
                badge: '1',
                linkClass:
                    'border border-solid rounded-md border-cyan-800 bg-cyan-900 hover:bg-cyan-700 text-white! cursor-pointer p-2',
                command: () => {
                    console.log('Comando');
                }
            }
        ];
        this.home = { icon: 'pi pi-home' };
    }
}
