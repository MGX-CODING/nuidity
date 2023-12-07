import { TestBed } from '@angular/core/testing';

import { NuidityService } from './nuidity.service';

describe('NuidityService', () => {
  let service: NuidityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuidityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
