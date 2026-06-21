import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetosEditar } from './projetos-editar';

describe('ProjetosEditar', () => {
    let component: ProjetosEditar;
    let fixture: ComponentFixture<ProjetosEditar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProjetosEditar]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjetosEditar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
