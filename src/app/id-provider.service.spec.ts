import { TestBed } from '@angular/core/testing';

import { IdProviderService } from './id-provider.service';

describe('IdProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdProviderService = TestBed.get(IdProviderService);
    expect(service).toBeTruthy();
  });
});
