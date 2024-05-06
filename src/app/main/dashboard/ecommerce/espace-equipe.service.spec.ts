import { TestBed } from '@angular/core/testing';

import { EspaceEquipeService } from './espace-equipe.service';

describe('EspaceEquipeService', () => {
  let service: EspaceEquipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaceEquipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
