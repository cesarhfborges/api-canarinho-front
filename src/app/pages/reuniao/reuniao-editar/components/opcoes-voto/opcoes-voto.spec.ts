import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcoesVoto } from './opcoes-voto';

describe('OpcoesVoto', () => {
  let component: OpcoesVoto;
  let fixture: ComponentFixture<OpcoesVoto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcoesVoto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcoesVoto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
