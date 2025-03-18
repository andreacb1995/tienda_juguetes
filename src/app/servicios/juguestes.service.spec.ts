import { TestBed } from '@angular/core/testing';

import { JuguestesService } from './juguestes.service';

describe('JuguestesService', () => {
  let service: JuguestesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JuguestesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
