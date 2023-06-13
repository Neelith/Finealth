import { TestBed } from '@angular/core/testing';

import { EchartOptionsService } from './echart-options.service';

describe('EchartOptionsService', () => {
  let service: EchartOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchartOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
