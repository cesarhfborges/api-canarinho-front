import { Component, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/shared/layout/service/layout.service';
import { TieredMenu } from 'primeng/tieredmenu';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth-service';
import { Logotipo } from '@/app/shared/components/logotipo/logotipo';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, TieredMenu, Ripple, Logotipo],
    template: `
        <div class="layout-topbar shadow-lg">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <app-logotipo class="block h-12 shrink-0 mx-auto" />
                    <span>SVO</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <!--            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">-->
                <!--                <i class="pi pi-ellipsis-v"></i>-->
                <!--            </button>-->

                <!--            <div class="layout-topbar-menu hidden lg:block">-->
                <!--                <div class="layout-topbar-menu-content">-->
                <!--                    <button type="button" class="layout-topbar-action">-->
                <!--                        <i class="pi pi-calendar"></i>-->
                <!--                        <span>Calendar</span>-->
                <!--                    </button>-->
                <!--                    <button type="button" class="layout-topbar-action">-->
                <!--                        <i class="pi pi-inbox"></i>-->
                <!--                        <span>Messages</span>-->
                <!--                    </button>-->
                <!--                </div>-->
                <!--            </div>-->

                <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <p-tieredMenu #menu [model]="items" [popup]="true">
                    <ng-template #item let-item>
                        <a pRipple class="flex items-center px-4 py-3 cursor-pointer" [class]="item.linkClass"
                           [routerLink]="item?.routerLink">
                            <span [ngClass]="item.icon" class="mr-2"></span>
                            <span class="ms-2">{{ item.label }}</span>
                            <!-- <p-badge *ngIf="item.badge" class="ms-auto" [value]="item.badge" />-->
                            <!-- <span *ngIf="item.shortcut" class="ms-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>-->
                        </a>
                    </ng-template>
                </p-tieredMenu>
            </div>
        </div>
    `
})
export class AppTopbar {
    items: MenuItem[] = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            routerLink: '/perfil'
            // command: () => {
            //     this.logout();
            // }
        },
        {
            separator: true
        },
        {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
                this.logout();
            }
        }
    ];

    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    private _router = inject(Router);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    logout(): void {
        this.confirmationService.confirm({
            header: 'Atenção',
            message: 'Deseja realmente sair do sistema?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Não',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Sim, desejo sair',
                severity: 'danger'
            },

            accept: () => {
                this.authService.logout().subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Atenção', detail: 'Logout efetuado com sucesso.' });
                        void this._router.navigate(['/login']);
                    },
                    error: (err) => {}
                });
            }
            // reject: () => {
            //     this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            // }
        });
    }
}
