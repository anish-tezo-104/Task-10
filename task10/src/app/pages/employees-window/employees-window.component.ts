import { Component, inject } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { SharedService } from '../../services/shared.service';
import { AlphabetFilterComponent } from '../../components/alphabet-filter/alphabet-filter.component';
import { RouterModule } from '@angular/router';
import { ExportToCSVService } from '../../services/export-to-csv.service';
import { EmployeesService } from '../../services/employees.service';
import { Dropdown } from '../../models/dropdown';

import { EMPLOYEE_FILTER_CONFIG } from '../../config/employee-filter.config';
import { ToasterService } from '../../services/toaster.service';
import { SuccessCodes } from '../../enums/success-codes';

@Component({
  selector: 'app-employees-window',
  standalone: true,
  imports: [CommonModule, EmployeeTableComponent, FilterBarComponent, AlphabetFilterComponent, RouterModule],
  templateUrl: './employees-window.component.html',
  styleUrls: ['./employees-window.component.css', '../home/home.component.css']
})
export class EmployeesWindowComponent {
  totalEmployees: Employee[] = [];
  employeesList: Employee[] = [];
  isEmployeesFetched: boolean = false;
  selectedEmployeesFilters: SelectedEmployeesFilter = createDefaultSelectedEmployeesFilter();

  pageNumber: number = 1;
  pageSize: number = 5;
  statusOptions: Dropdown[] = [];
  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];
  filterConfig = EMPLOYEE_FILTER_CONFIG;

  sharedService = inject(SharedService);
  constructor(private exportToCSVService: ExportToCSVService,
    private toast: ToasterService,
    private employeesService: EmployeesService) {
    this.sharedService.resetEmployeesFilters();
  }

  ngOnInit(): void {
    this.statusOptions = JSON.parse(localStorage.getItem('statusOptions') || '[]');
    this.locationOptions = JSON.parse(localStorage.getItem('locationOptions') || '[]');
    this.departmentOptions = JSON.parse(localStorage.getItem('departmentOptions') || '[]');

    this.filterConfig[0].options = this.statusOptions;
    this.filterConfig[1].options = this.departmentOptions;
    this.filterConfig[2].options = this.locationOptions;

    this.sharedService.setPageNumber(this.pageNumber);
    this.sharedService.setPageSize(this.pageSize);


    this.sharedService.selectedEmployeesFilters$.subscribe(filters => {
      this.selectedEmployeesFilters = filters;
    });

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;

    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });

    this.sharedService.loadEmployees();

    this.sharedService.employees$.subscribe({
      next: (data: Employee[]) => {
        this.employeesList = data;
      },
      error: () => {

      },
      complete: () => {
        this.isEmployeesFetched = true;
      }
    });

  }

  exportEmployeesToCSV(): void {
    const fileName = 'employees.csv';
    this.employeesService.getEmployees(this.selectedEmployeesFilters, this.pageNumber, this.pageSize).subscribe({
      next: (data: Employee[] | any) => {
        const columnsToIgnore = ['profileImageData', 'profileImagePath', 'modeStatusId', 'modeStatusName'];
        this.exportToCSVService.exportToCSV(fileName, data, columnsToIgnore);
      },
      complete: () => {
        this.toast.showSuccessToaster(SuccessCodes.EXPORT_TO_CSV_SUCCESS)
      }
    });
  }
}
