import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuniaoListar } from './reuniao-listar';

describe('ReuniaoListar', () => {
  let component: ReuniaoListar;
  let fixture: ComponentFixture<ReuniaoListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuniaoListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuniaoListar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
