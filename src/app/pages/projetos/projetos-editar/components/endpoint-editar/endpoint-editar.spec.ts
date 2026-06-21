import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointEditar } from './endpoint-editar';

describe('EndpointEditar', () => {
    let component: EndpointEditar;
    let fixture: ComponentFixture<EndpointEditar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EndpointEditar]
        }).compileComponents();

        fixture = TestBed.createComponent(EndpointEditar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
