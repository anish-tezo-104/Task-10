import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../../../models/employee';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../filter-bar/filter-bar.component';
import { SharedService } from '../../../services/shared.service';
import { EmployeesService } from '../../../services/employees.service';
import { RouterModule } from '@angular/router';
import { createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../../../models/selected-employees-filter';


@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, RouterModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css', '../employees-window.component.css' , '../../../app.component.css']
})
export class EmployeeTableComponent {
  @Input() employeesList: Employee[] = [];
  isLoading: boolean = false;
  openEmployeeId: number | null = null;
  selectedEmployees: number[] = [];
  pageNumber: number = 1;
  pageSize: number = 5;
  totalEmployees: number = 0
  selectedFilters: SelectedEmployeesFilter = createDefaultSelectedEmployeesFilter();

  constructor(private sharedService: SharedService, private employeesService: EmployeesService) { }

  ngOnInit() {
    this.sharedService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.sharedService.setPageNumber(this.pageNumber);
    this.sharedService.setPageSize(this.pageSize);

    this.sharedService.selectedEmployeesFilters$.subscribe(filters => {
      this.selectedFilters = filters;
    });

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;

    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });

    this.sharedService.loadEmployees();
  }

  changePage(pageNumber: number): void {
    this.sharedService.setPageNumber(pageNumber);
    this.sharedService.loadEmployees(this.selectedFilters);
  }

  changePageSize(event: Event): void {
    const pageSize = (event.target as HTMLSelectElement).value;
    this.sharedService.setPageSize(Number(pageSize));
    this.sharedService.loadEmployees(this.selectedFilters);
  }

  toggleMenu(employeeId: number): void {
    if (this.openEmployeeId === employeeId) {
      this.openEmployeeId = null;
    } else {
      this.openEmployeeId = employeeId;
    }
  }

  isMenuOpen(employeeId: number): boolean {
    return this.openEmployeeId === employeeId;
  }

  deleteEmployee(employee: Employee): void {
    {
      this.employeesService.deleteEmployees([employee.id]).subscribe(
        {
          next: () => {
            this.sharedService.loadEmployees();
          },
          error: err => {
            console.error('Error deleting employee:', err);
          },
          complete: () => {
            console.log('Employee deletion completed');
            this.sharedService.loadEmployeesGroupedByDepartment();
          }
        }
      );
    }
  }

  deleteSelectedEmployees(): void {
    if (this.selectedEmployees.length === 0) {
      alert('Please select at least one employee to delete.');
      return;
    }

    if (confirm('Are you sure you want to delete the selected employees?')) {
      this.employeesService.deleteEmployees(this.selectedEmployees).subscribe(
        {
          next: () => {
            this.sharedService.loadEmployees();
          },
          error: err => {
            console.error('Error deleting employee:', err);
          },
          complete: () => {
            console.log('Employee deletion completed');
            this.selectedEmployees = [];
            this.sharedService.loadEmployeesGroupedByDepartment();
          }
        }
      );
    }
  }

  toggleEmployeeSelection(employeeId: number): void {
    const index = this.selectedEmployees.indexOf(employeeId);
    if (index === -1) {
      this.selectedEmployees.push(employeeId);
    } else {
      this.selectedEmployees.splice(index, 1);
    }
  }

  isEmployeeSelected(employeeId: number): boolean {
    return this.selectedEmployees.includes(employeeId);
  }

  selectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.selectedEmployees = this.employeesList.map(employee => employee.id);
    } else {
      this.selectedEmployees = [];
    }
  }
}
