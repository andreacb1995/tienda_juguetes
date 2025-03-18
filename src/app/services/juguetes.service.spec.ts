import { TestBed } from '@angular/core/testing';

import { JuguetesService } from './juguetes.service';

describe('JuguetesService', () => {
  let service: JuguetesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JuguetesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
