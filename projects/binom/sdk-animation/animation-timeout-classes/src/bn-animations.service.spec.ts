import { TestBed } from '@angular/core/testing';

import { BnAnimationsService } from './bn-animations.service';

describe('BnAnimationsService', () => {
  let service: BnAnimationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnAnimationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
