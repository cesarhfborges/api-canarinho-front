import { TestBed } from '@angular/core/testing';

import { BloqueioVotoService } from './bloqueio-voto-service';

describe('BloqueioVotoService', () => {
  let service: BloqueioVotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloqueioVotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
