import { MenuItem } from 'primeng/api';

export const menu: MenuItem[] = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
            { label: 'Projetos', icon: 'pi pi-fw pi-folder', routerLink: ['/projetos'] }
        ]
    }
];
