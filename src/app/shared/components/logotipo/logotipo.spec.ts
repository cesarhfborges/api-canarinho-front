import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logotipo } from './logotipo';

describe('Logotipo', () => {
  let component: Logotipo;
  let fixture: ComponentFixture<Logotipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logotipo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Logotipo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
