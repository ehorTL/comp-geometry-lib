import { TestBed } from '@angular/core/testing';

import { AlgorithmLoaderService } from './algorithm-loader.service';

describe('AlgorithmLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlgorithmLoaderService = TestBed.get(AlgorithmLoaderService);
    expect(service).toBeTruthy();
  });
});
