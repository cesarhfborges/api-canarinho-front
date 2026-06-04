import { TestBed } from '@angular/core/testing';

import { OpcaoVotoService } from './opcao-voto-service';

describe('OpcaoVotoService', () => {
  let service: OpcaoVotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcaoVotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
