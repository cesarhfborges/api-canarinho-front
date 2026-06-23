import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)"
                >
                    <div
                        class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center"
                        style="border-radius: 53px"
                    >
                        <span class="text-primary font-bold text-3xl">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">
                            Página Não Encontrada
                        </h1>
                        <div class="text-surface-600 dark:text-surface-200 mb-8">
                            Ops! A página que você tentou acessar não existe.
                        </div>
                        <a
                            routerLink="/"
                            class="w-full flex items-center justify-center mb-8 py-4 px-4 border border-surface-200 dark:border-surface-700 hover:border-primary transition-colors duration-200 cursor-pointer rounded-border"
                        >
                            <i class="pi pi-fw pi-arrow-left text-primary text-2xl mr-4"></i>
                            <div class="flex flex-col">
                                <span class="text-surface-900 dark:text-surface-0 font-bold mb-1"
                                    >Voltar ao Início</span
                                >
                                <span class="text-surface-600 dark:text-surface-200 text-sm"
                                    >Ir para a tela de projetos ou login.</span
                                >
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Notfound {}
