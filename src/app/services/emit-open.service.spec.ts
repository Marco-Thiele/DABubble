import { TestBed } from '@angular/core/testing';

import { EmitOpenService } from './emit-open.service';

describe('EmitOpenService', () => {
  let service: EmitOpenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmitOpenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
