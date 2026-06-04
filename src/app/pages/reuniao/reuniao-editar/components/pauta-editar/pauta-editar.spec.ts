import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PautaEditar } from './pauta-editar';

describe('PautaEditar', () => {
  let component: PautaEditar;
  let fixture: ComponentFixture<PautaEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PautaEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PautaEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
