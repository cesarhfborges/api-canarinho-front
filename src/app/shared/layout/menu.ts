import { MenuItem } from 'primeng/api';

export const menu: MenuItem[] = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
            { label: 'Projetos', icon: 'pi pi-fw pi-link', routerLink: ['/projetos'] }
        ]
    },
    {
        label: 'Cadastros',
        items: [
            {
                label: 'Usuários',
                icon: 'pi pi-users',
                routerLink: ['/usuarios']
            },
            {
                label: 'Perfis de Acesso',
                icon: 'pi pi-shield',
                routerLink: ['/perfis']
            },
            {
                label: 'Reunião',
                icon: 'pi pi-calendar',
                routerLink: ['/reuniao']
            }
        ]
    },
    {
        label: 'Comunicação',
        items: [
            {
                label: 'Notificações',
                icon: 'pi pi-bell',
                routerLink: ['/notificacoes']
            },
            {
                label: 'Convocações',
                icon: 'pi pi-send',
                routerLink: ['/convocacoes']
            },
            {
                label: 'Mensagens',
                icon: 'pi pi-envelope',
                routerLink: ['/mensagens']
            }
        ]
    },
    {
        label: 'Relatórios',
        items: [
            {
                label: 'Resultado das Votações',
                icon: 'pi pi-chart-bar',
                routerLink: ['/relatorios/votacoes']
            },
            {
                label: 'Participação',
                icon: 'pi pi-chart-line',
                routerLink: ['/relatorios/participacao']
            },
            {
                label: 'Atas',
                icon: 'pi pi-file-pdf',
                routerLink: ['/relatorios/atas']
            },
            {
                label: 'Auditoria',
                icon: 'pi pi-history',
                routerLink: ['/relatorios/auditoria']
            }
        ]
    },
    {
        label: 'Sistema',
        items: [
            {
                label: 'Configurações',
                icon: 'pi pi-cog',
                routerLink: ['/configuracoes']
            },
            {
                label: 'Integrações',
                icon: 'pi pi-link',
                routerLink: ['/integracoes']
            }
        ]
    }
];
