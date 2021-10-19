import { TestBed } from '@angular/core/testing';

import { GetExpensesService } from './get-expenses.service';

describe('GetExpensesService', () => {
  let service: GetExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
