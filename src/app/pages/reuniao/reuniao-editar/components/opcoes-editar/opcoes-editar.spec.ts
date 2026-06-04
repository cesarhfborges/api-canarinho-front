import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcoesEditar } from './opcoes-editar';

describe('OpcoesEditar', () => {
  let component: OpcoesEditar;
  let fixture: ComponentFixture<OpcoesEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcoesEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcoesEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
