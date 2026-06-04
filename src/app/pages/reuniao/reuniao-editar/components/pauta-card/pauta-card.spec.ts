import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PautaCard } from './pauta-card';

describe('PautaCard', () => {
  let component: PautaCard;
  let fixture: ComponentFixture<PautaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PautaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PautaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
