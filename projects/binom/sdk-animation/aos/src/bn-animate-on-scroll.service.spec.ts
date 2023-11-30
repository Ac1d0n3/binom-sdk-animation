import { TestBed } from '@angular/core/testing';

import { BnAnimateOnScrollService } from './bn-animate-on-scroll.service';

describe('BnAnimateOnScrollService', () => {
  let service: BnAnimateOnScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnAnimateOnScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
