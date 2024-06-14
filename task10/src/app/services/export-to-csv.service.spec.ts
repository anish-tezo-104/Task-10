import { TestBed } from '@angular/core/testing';

import { ExportToCSVService } from './export-to-csv.service';

describe('ExportToCSVService', () => {
  let service: ExportToCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportToCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
