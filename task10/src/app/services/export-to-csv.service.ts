import { Injectable } from '@angular/core';
import { ErrorCodes } from '../enums/error-codes';

@Injectable({
  providedIn: 'root'
})
export class ExportToCSVService {

  constructor() { }

  exportToCSV(fileName: string, data: any[], columnsToIgnore: string[] = []): void {
    try {
      const csvContent = this.convertToCSV(data, columnsToIgnore);
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
        } else {
          throw new Error('HTML5 download attribute not supported.');
        }
      }
    } catch (error) {
      throw new Error(ErrorCodes.FAILED_TO_EXPORT_CSV);
    }
  }

  private convertToCSV(data: any[], columnsToIgnore: string[] = []): string {
    const separator = ',';
    let keys = Object.keys(data[0]);

    keys = keys.filter(key => !columnsToIgnore.includes(key));

    const header = keys.join(separator) + '\n';
    const csv = data.map(row => {
      return keys.map(key => {
        return row[key];
      }).join(separator);
    }).join('\n');
    return header + csv;
  }
}
