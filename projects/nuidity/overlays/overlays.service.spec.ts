import { TestBed } from '@angular/core/testing';

import { NuiOverlaysService } from './overlays.service';

describe('OverlaysService', () => {
  let service: NuiOverlaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuiOverlaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
