import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-error',
    imports: [ButtonModule, RippleModule, RouterModule, ButtonModule],
    standalone: true,
    template: ` <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen overflow-hidden bg-[url(/assets/imgs/wallpaper.jpg)] bg-cover bg-center bg-no-repeat"
    >
        <div class="w-full flex flex-col items-center justify-center">
            <div
                class="w-5/6 md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-1/3"
                style="border-radius: 56px; padding: 0.25rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
            >
                <div class="bg-surface-0 dark:bg-surface-900 py-14 px-8 sm:px-14 shadow-lg" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-center mb-8">
                            <div
                                class="flex justify-center items-center border-2 border-pink-500 rounded-full"
                                style="height: 3.2rem; width: 3.2rem"
                            >
                                <i class="pi pi-fw pi-exclamation-circle text-2xl! text-pink-500"></i>
                            </div>
                            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-2">Error Occured</h1>
                            <span class="text-muted-color mb-8">Requested resource is not available.</span>
                            <img
                                src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg"
                                alt="Error"
                                class="mb-8"
                                width="80%"
                            />
                            <div class="col-span-12 mt-8 text-center">
                                <p-button label="Go to Dashboard" routerLink="/" severity="danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class Error {}
