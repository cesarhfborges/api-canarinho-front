import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetosListar } from './projetos-listar';

describe('ProjetosListar', () => {
    let component: ProjetosListar;
    let fixture: ComponentFixture<ProjetosListar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProjetosListar]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjetosListar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
