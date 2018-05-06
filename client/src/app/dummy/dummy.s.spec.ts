import { TestBed } from '@angular/core/testing';

import { DummyService } from './dummy.s';

describe('DS test', () => {
  let service: DummyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DummyService ]
    });
    service = TestBed.get(DummyService);
  });

  test('should exist', () => {
    expect(service).toBeTruthy();
  });
})