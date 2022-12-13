import { TestBed } from '@angular/core/testing';

import { TemplatedataService } from './templatedata.service';

describe('TemplatedataService', () => {
  let service: TemplatedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
