import { TestBed } from '@angular/core/testing';

import { CreateExpenseService } from './create-expense.service';

describe('CreateExpenseService', () => {
  let service: CreateExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
