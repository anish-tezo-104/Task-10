import { Injectable } from '@angular/core';
import { EmployeesService } from './employees.service';
import { SelectedEmployeesFilter } from '../models/selected-employees-filter';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class ExportToCSVService {

  constructor() { }

  exportToCSV(fileName: string, data: any[]): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  private convertToCSV(data: any[]): string {
    const separator = ',';
    const keys = Object.keys(data[0]);
    const header = keys.join(separator) + '\n';
    const csv = data.map(row => {
      return keys.map(key => {
        return row[key];
      }).join(separator);
    }).join('\n');
    return header + csv;
  }
}
