import { Component, inject } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import {  createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { SharedService } from '../../services/shared.service';
import { AlphabetFilterComponent } from '../alphabet-filter/alphabet-filter.component';
import { RouterModule } from '@angular/router';
import { ExportToCSVService } from '../../services/export-to-csv.service';
import { EmployeesService } from '../../services/employees.service';
import { Dropdown } from '../../models/dropdown';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';
import { EMPLOYEE_FILTER_CONFIG } from '../../config/employee-filter.config';

@Component({
  selector: 'app-employees-window',
  standalone: true,
  imports: [CommonModule, EmployeeTableComponent, FilterBarComponent, AlphabetFilterComponent, RouterModule],
  templateUrl: './employees-window.component.html',
  styleUrls: ['./employees-window.component.css', '../../app.component.css']
})
export class EmployeesWindowComponent {
  totalEmployees: Employee[] = [];
  employeesList: Employee[] = [];
  isLoading: boolean = false;
  selectedEmployeesFilters: SelectedEmployeesFilter = createDefaultSelectedEmployeesFilter();

  pageNumber: number = 1;
  pageSize: number = 5;
  statusOptions: Dropdown[] = [];
  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];
  filterConfig = EMPLOYEE_FILTER_CONFIG;

  sharedService = inject(SharedService);
  constructor(private exportToCSVService: ExportToCSVService, private employeesService: EmployeesService, private localStorageService: LocalStorageServiceService) {
    this.sharedService.resetEmployeesFilters();
  }

  ngOnInit(): void {
    this.statusOptions = this.localStorageService.getItem('statusOptions');
    this.locationOptions = this.localStorageService.getItem('locationOptions');
    this.departmentOptions = this.localStorageService.getItem('departmentOptions');

    this.filterConfig[0].options = this.statusOptions;
    this.filterConfig[1].options = this.departmentOptions;
    this.filterConfig[2].options = this.locationOptions;

    this.sharedService.setPageNumber(this.pageNumber);
    this.sharedService.setPageSize(this.pageSize);
    this.sharedService.loadEmployees();

    this.sharedService.getEmployeesList().subscribe({
      next: (data: Employee[]) => {
        this.employeesList = data;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    this.sharedService.selectedEmployeesFilters$.subscribe(filters => {
      this.selectedEmployeesFilters = filters;
    });

    this.sharedService.getLoadingStatus().subscribe({
      next: (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    });

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;

    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });

  }
  
  exportEmployeesToCSV(): void {
    const fileName = 'employees.csv';
    console.log(this.selectedEmployeesFilters);
    this.employeesService.getEmployees(this.selectedEmployeesFilters, this.pageNumber, this.pageSize).subscribe({
      next: (data: Employee[]) => {
        this.exportToCSVService.exportToCSV(fileName, data);
      },
      error: (err) => {
        console.error('Error exporting employees to CSV:', err);
      }
    });
  }
}
