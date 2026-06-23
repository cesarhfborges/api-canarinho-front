import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { PerfilService } from '@/app/core/services/perfil-service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model(); track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    perfilService = inject(PerfilService);

    model = computed<MenuItem[]>(() => {
        const isAdmin = this.perfilService.userProfile()?.is_admin;

        const baseMenu: MenuItem[] = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                    { label: 'Projetos', icon: 'pi pi-fw pi-folder', routerLink: ['/projetos'] }
                ]
            }
        ];

        if (isAdmin) {
            baseMenu.push({
                label: 'Administração',
                items: [
                    { label: 'Usuários', icon: 'pi pi-fw pi-users', routerLink: ['/usuarios'] },
                    { label: 'Configurações', icon: 'pi pi-fw pi-cog', routerLink: ['/configuracoes'] }
                ]
            });
        }

        return baseMenu;
    });
}
