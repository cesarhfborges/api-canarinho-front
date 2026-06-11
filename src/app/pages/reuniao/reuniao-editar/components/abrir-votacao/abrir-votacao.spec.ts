import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrirVotacao } from './abrir-votacao';

describe('AbrirVotacao', () => {
    let component: AbrirVotacao;
    let fixture: ComponentFixture<AbrirVotacao>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AbrirVotacao]
        }).compileComponents();

        fixture = TestBed.createComponent(AbrirVotacao);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
