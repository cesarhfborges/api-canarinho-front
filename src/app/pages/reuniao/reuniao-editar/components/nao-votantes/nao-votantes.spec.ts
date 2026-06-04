import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaoVotantes } from './nao-votantes';

describe('NaoVotantes', () => {
  let component: NaoVotantes;
  let fixture: ComponentFixture<NaoVotantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoVotantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaoVotantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
