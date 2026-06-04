import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuniaoDetalhe } from './reuniao-detalhe';

describe('ReuniaoDetalhe', () => {
  let component: ReuniaoDetalhe;
  let fixture: ComponentFixture<ReuniaoDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuniaoDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuniaoDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
