import { TestBed } from '@angular/core/testing';

import { SectionsLoaderService } from './sections-loader.service';

describe('SectionsLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectionsLoaderService = TestBed.get(SectionsLoaderService);
    expect(service).toBeTruthy();
  });
});
