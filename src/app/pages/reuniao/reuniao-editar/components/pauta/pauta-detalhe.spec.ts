import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PautaDetalhe } from './pauta-detalhe';

describe('PautaDetalhe', () => {
  let component: PautaDetalhe;
  let fixture: ComponentFixture<PautaDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PautaDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PautaDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
