import { TestBed } from '@angular/core/testing';

import { CashMovementRepositoryService } from './cash-movement-repository.service';

describe('CashMovementRepositoryService', () => {
  let service: CashMovementRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashMovementRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
