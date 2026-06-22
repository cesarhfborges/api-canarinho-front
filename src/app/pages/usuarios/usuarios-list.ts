import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuariosService } from '@/app/core/services/usuarios-service';
import { PerfilService, UserProfile } from '@/app/core/services/perfil-service';
import { UsuarioEditar } from './components/usuario-editar/usuario-editar';
import { UsuarioSenhaModal } from '@/app/shared/components/usuario-senha-modal/usuario-senha-modal';

@Component({
    selector: 'app-usuarios-list',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, ButtonModule, TooltipModule],
    providers: [DialogService],
    templateUrl: './usuarios-list.html'
})
export class UsuariosList {
    private usuariosService = inject(UsuariosService);
    private perfilService = inject(PerfilService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private dialogService = inject(DialogService);

    data = signal<UserProfile[]>([]);
    totalRecords = signal<number>(0);
    loading = signal<boolean>(false);

    lastEvent: TableLazyLoadEvent | null = null;

    carregarDados(event: TableLazyLoadEvent) {
        this.lastEvent = event;
        this.loading.set(true);

        const page = event.first !== undefined && event.rows ? (event.first / event.rows) + 1 : 1;
        const perPage = event.rows || 10;

        let params: any = { page, per_page: perPage };

        if (event.sortField) {
            params.orderBy = event.sortField;
            params.orderDir = event.sortOrder === 1 ? 'asc' : 'desc';
        }

        this.usuariosService.listar(params).subscribe({
            next: (res) => {
                this.data.set(res.data);
                this.totalRecords.set(res.total);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    recarregar() {
        if (this.lastEvent) {
            this.carregarDados(this.lastEvent);
        } else {
            this.carregarDados({ first: 0, rows: 10 });
        }
    }

    isCurrentUser(userId: number): boolean {
        return this.perfilService.userProfile()?.id === userId;
    }

    novoUsuario() {
        const ref = this.dialogService.open(UsuarioEditar, {
            header: 'Novo Usuário',
            modal: true,
            closable: true,
            width: '500px'
        });

        if (ref) {
            ref.onClose.subscribe((success: boolean) => {
                if (success) this.recarregar();
            });
        }
    }

    editarUsuario(user: UserProfile) {
        const ref = this.dialogService.open(UsuarioEditar, {
            header: 'Editar Usuário',
            modal: true,
            closable: true,
            width: '500px',
            data: { user }
        });

        if (ref) {
            ref.onClose.subscribe((success: boolean) => {
                if (success) this.recarregar();
            });
        }
    }

    alterarSenha(user: UserProfile) {
        this.dialogService.open(UsuarioSenhaModal, {
            header: 'Alterar Senha',
            modal: true,
            closable: true,
            width: '400px',
            data: { userId: user.id, isProfile: false }
        });
    }

    excluir(event: Event, user: UserProfile) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Tem certeza que deseja excluir o usuário "${user.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.loading.set(true);
                this.usuariosService.excluir(user.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído.' });
                        this.recarregar();
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Erro ao excluir.' });
                        this.loading.set(false);
                    }
                });
            }
        });
    }
}
