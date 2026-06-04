import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuniaoEditar } from './reuniao-editar';

describe('ReuniaoEditar', () => {
  let component: ReuniaoEditar;
  let fixture: ComponentFixture<ReuniaoEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuniaoEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuniaoEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
