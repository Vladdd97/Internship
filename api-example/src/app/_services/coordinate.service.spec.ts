import { TestBed, inject } from '@angular/core/testing';

import { CoordinateService } from './coordinate.service';

describe('CoordinateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoordinateService]
    });
  });

  it('should be created', inject([CoordinateService], (service: CoordinateService) => {
    expect(service).toBeTruthy();
  }));
});
