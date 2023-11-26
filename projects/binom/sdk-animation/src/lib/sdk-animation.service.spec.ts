import { TestBed } from '@angular/core/testing';

import { SdkAnimationService } from './sdk-animation.service';

describe('SdkAnimationService', () => {
  let service: SdkAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SdkAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
