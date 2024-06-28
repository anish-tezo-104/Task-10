import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { SharedService } from '../../services/shared.service';
import { EmployeesService } from '../../services/employees.service';
import { RouterModule } from '@angular/router';
import { createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { ToasterService } from '../../services/toaster.service';
import { SuccessCodes } from '../../enums/success-codes';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';


@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, RouterModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css', '../../pages/employees-window/employees-window.component.css', '../../pages/home/home.component.css']
})
export class EmployeeTableComponent {
  @Input() employeesList: Employee[] = [];
  @Input() isEmployeesFetched: boolean = true;
  openEmployeeId: number | null = null;
  selectedEmployees: number[] = [];
  pageNumber: number = 1;
  pageSize: number = 5;
  totalEmployees: number = 0
  selectedFilters: SelectedEmployeesFilter = createDefaultSelectedEmployeesFilter();
  sortColumn: number = 1;
  sortOrder: 'ascending' | 'descending' = 'ascending';

  @ViewChild('ellipsisMenu') ellipsisMenu: ElementRef | undefined;

  constructor(
    private sharedService: SharedService,
    private employeesService: EmployeesService,
    private toast: ToasterService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
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
    this.updateEmployeesList();
    this.isEmployeesFetched = true;
  }


  changePageSize(event: Event): void {
    const pageSize = (event.target as HTMLSelectElement).value;
    this.sharedService.setPageSize(Number(pageSize));
    this.sharedService.loadEmployees(this.selectedFilters);
    this.updateEmployeesList();
    this.isEmployeesFetched = true;
  }

  updateEmployeesList(): void {
    this.sharedService.employees$.subscribe({
      next: (data) => {
        this.isEmployeesFetched = false;
        this.employeesList = data;
      },
      complete: () => {
        this.isEmployeesFetched = true;
      }
    })
  }

  toggleMenu(employeeId: number): void {
    if (this.openEmployeeId === employeeId) {
      this.openEmployeeId = null;
    } else {
      this.openEmployeeId = employeeId;
    }
  }

  getProfileImage(employee: Employee): string {
    return employee.profileImageData ? 'data:image/jpeg;base64,' + employee.profileImageData : "../../../assets/default-user.png";
  }

  isMenuOpen(employeeId: number): boolean {
    return this.openEmployeeId === employeeId;
  }

  deleteEmployee(employee: Employee): void {
    {
      this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete ?')
        .then((confirmed) => {
          if (confirmed) {
            this.employeesService.deleteEmployees([employee.id]).subscribe(
              {
                next: () => {
                  this.sharedService.loadEmployees();
                },
                complete: () => {
                  this.toast.showSuccessToaster(SuccessCodes.DELETE_EMPLOYEE_SUCCESS)
                  this.sharedService.loadEmployeesGroupedByDepartment();
                }
              }
            );
          }
        })
    }
  }

  deleteSelectedEmployees(): void {
    if (this.selectedEmployees.length === 0) {
      this.toast.showInfoToaster('Select minimum 1 employee', 'Warning');
      return;
    }

    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete ${this.selectedEmployees.length} employee(s))?`)
      .then((confirmed) => {
        if (confirmed) {
          this.employeesService.deleteEmployees(this.selectedEmployees).subscribe({
            next: () => {
              this.sharedService.loadEmployees();
            },
            complete: () => {
              this.toast.showSuccessToaster(`${this.selectedEmployees.length} employee(s) deleted successfully`);
              this.selectedEmployees = [];
              this.sharedService.loadEmployeesGroupedByDepartment();
            }
          });
        }
      })
  }


  toggleEmployeeSelection(employeeId: number): void {
    const index = this.selectedEmployees.indexOf(employeeId);
    if (index === -1) {
      this.selectedEmployees.push(employeeId);
    } else {
      this.selectedEmployees.splice(index, 1);
    }
    this.checkSelectAllState();
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

  checkSelectAllState(): void {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = this.isAllSelected();
    }
  }

  isAllSelected(): boolean {
    return this.employeesList.length > 0 && this.selectedEmployees.length === this.employeesList.length;
  }

  sortTable(column_number: number): void {
    // Toggle sort order if the same column is clicked again
    if (column_number === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
    } else {
      // Reset sort order when a new column is clicked
      this.sortColumn = column_number;
      this.sortOrder = 'ascending';
    }

    // Perform sorting
    this.employeesList.sort((a, b) => {
      const x = this.getColumnValue(a, column_number);
      const y = this.getColumnValue(b, column_number);

      // Adjust comparison based on data type (e.g., numbers, strings, dates)
      if (typeof x === 'string' && typeof y === 'string') {
        return this.sortOrder === 'ascending' ? x.localeCompare(y) : y.localeCompare(x);
      } else {
        return this.sortOrder === 'ascending' ? x - y : y - x;
      }
    });
  }

  getColumnValue(row: any, column_number: number): any {
    switch (column_number) {
      case 1: return `${row.firstName || ''} ${row.lastName || ''}`.toLowerCase();
      case 2: return (row.locationName || '').toLowerCase();
      case 3: return (row.departmentName || '').toLowerCase();
      case 4: return (row.roleName || '').toLowerCase();
      case 5: return row.uid || '';
      case 6: return row.status ? 1 : 0;
      case 7: return new Date(row.joiningDate).getTime();
      default: return '';
    }
  }
}
