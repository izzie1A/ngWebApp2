import { TestBed } from '@angular/core/testing';

import { FirebaseControlService } from './firebase-control.service';

describe('FirebaseControlService', () => {
  let service: FirebaseControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
