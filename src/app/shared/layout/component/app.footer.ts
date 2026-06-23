import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <span> Todos os direitos reservados. <strong> Api Canarinho © </strong>{{ currentYear }}</span>
    </div>`
})
export class AppFooter {
    protected readonly currentYear = new Date().getFullYear();
}
