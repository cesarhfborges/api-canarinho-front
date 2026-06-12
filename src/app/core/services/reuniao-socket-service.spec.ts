import { TestBed } from '@angular/core/testing';

import { ReuniaoSocketService } from './reuniao-socket-service';

describe('ReuniaoSocketService', () => {
    let service: ReuniaoSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReuniaoSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
