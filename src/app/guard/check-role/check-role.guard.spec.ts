import { TestBed, async, inject } from '@angular/core/testing';

import { CheckRoleGuard } from './check-role.guard';

describe('CheckRoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckRoleGuard]
    });
  });

  it('should ...', inject([CheckRoleGuard], (guard: CheckRoleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
