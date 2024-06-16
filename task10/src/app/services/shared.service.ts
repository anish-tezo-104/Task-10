import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createDefaultSelectedEmployeesFilter, SelectedEmployeesFilter } from '../models/selected-employees-filter';
import { EmployeesService } from './employees.service';
import { Employee } from '../models/employee';
import { DepartmentEmployeeGroup } from '../models/department-employee-group';
import { createDefaultSelectedRolesFilter, SelectedRolesFilter } from '../models/selected-roles-filter';
import { RolesService } from './roles.service';
import { Role } from '../models/role';
import { ToasterService } from './toaster.service';
import { AuthService } from '../auth/auth.service';
import { SuccessCodes } from '../enums/success-codes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  toast = inject(ToasterService);
  router = inject(Router);

  private employeesSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  public employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  private rolesSubject: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  public roles$: Observable<Role[]> = this.rolesSubject.asObservable();

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private selectedEmployeesFiltersSubject: BehaviorSubject<SelectedEmployeesFilter> = new BehaviorSubject<SelectedEmployeesFilter>(createDefaultSelectedEmployeesFilter());
  public selectedEmployeesFilters$: Observable<SelectedEmployeesFilter> = this.selectedEmployeesFiltersSubject.asObservable();

  private selectedRolesFiltersSubject: BehaviorSubject<SelectedRolesFilter> = new BehaviorSubject<SelectedRolesFilter>(createDefaultSelectedRolesFilter());
  public selectedRolesFilters$: Observable<SelectedRolesFilter> = this.selectedRolesFiltersSubject.asObservable();

  private filtersAppliedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public filtersApplied$: Observable<boolean> = this.filtersAppliedSubject.asObservable();

  private btnResetStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public btnResetState$: Observable<boolean> = this.btnResetStateSubject.asObservable();

  private btnApplyStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public btnApplyState$: Observable<boolean> = this.btnApplyStateSubject.asObservable();

  private resetAlphabetButtonsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public resetAlphabetButtons$: Observable<boolean> = this.resetAlphabetButtonsSubject.asObservable();

  private employeesGroupedByDepartmentSubject: BehaviorSubject<DepartmentEmployeeGroup[]> = new BehaviorSubject<DepartmentEmployeeGroup[]>([]);
  public employeesGroupedByDepartment$: Observable<DepartmentEmployeeGroup[]> = this.employeesGroupedByDepartmentSubject.asObservable();

  private alphabetActiveSubject = new BehaviorSubject<boolean>(false);
  alphabetActive$ = this.alphabetActiveSubject.asObservable();

  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_PAGE_SIZE = 5;

  private pageNumberSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.DEFAULT_PAGE_NUMBER);
  public pageNumber$: Observable<number> = this.pageNumberSubject.asObservable();
  private pageSizeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.DEFAULT_PAGE_SIZE);
  public pageSize$: Observable<number> = this.pageSizeSubject.asObservable();

  constructor(private rolesService: RolesService,
    private employeesService: EmployeesService,
    private authService: AuthService) { }


  logout(id: number): void {
    this.authService.logout(id).subscribe({
      next: () => {
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
      },
      complete: () => {
        localStorage.clear();
        this.toast.showSuccessToaster(SuccessCodes.LOGGED_OUT_SUCCESS);
        this.router.navigate(['/Login']);
      }
    })
  }

  loadEmployeesGroupedByDepartment(): void {
    this.employeesService.getEmployeesGroupedByDepartment().subscribe({
      next: (data: DepartmentEmployeeGroup[]) => {
        if (Array.isArray(data)) {
          this.employeesGroupedByDepartmentSubject.next(data);
        } else {
          this.employeesGroupedByDepartmentSubject.next([]);
        }
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
        this.employeesGroupedByDepartmentSubject.next([]);
      }
    });
  }

  searchEmployees(searchKeyword: string): void {
    this.employeesService.getEmployees(undefined, this.getPageNumber(), this.getPageSize(), searchKeyword).subscribe({
      next: (data: Employee[] | Error) => {
        if (Array.isArray(data)) {
          this.employeesSubject.next(data);
        } else {
          this.employeesSubject.next([]);
        }
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
        this.isLoadingSubject.next(false);
        this.employeesSubject.next([]);
      },
      complete: () => {
        this.isLoadingSubject.next(false);
      }
    }
    );
  }

  searchRoles(searchKeyword: string): void {
    this.rolesService.getRoles(undefined, this.getPageNumber(), this.getPageSize(), searchKeyword).subscribe({
      next: (data: Role[]) => {
        if (Array.isArray(data)) {
          this.rolesSubject.next(data);
        } else {
          this.rolesSubject.next([]);
        }
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
        this.isLoadingSubject.next(false);
        this.rolesSubject.next([]);
      },
      complete: () => {
        this.isLoadingSubject.next(false);
      }
    }
    );
  }

  loadEmployees(filters?: SelectedEmployeesFilter): void {
    this.isLoadingSubject.next(true);
    const pageNumber = this.pageNumberSubject.value;
    const pageSize = this.pageSizeSubject.value;
    this.employeesService.getEmployees(filters, pageNumber, pageSize).subscribe({
      next: (data: Employee[] | Error) => {
        if (Array.isArray(data)) {
          this.employeesSubject.next(data);
        } else {
          this.employeesSubject.next([]);
        }
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
        this.isLoadingSubject.next(false);
        this.employeesSubject.next([]);
      },
      complete: () => {
        this.isLoadingSubject.next(false);
      }
    });
  }

  loadRoles(filters?: SelectedRolesFilter): void {
    this.isLoadingSubject.next(true);
    const pageNumber = this.pageNumberSubject.value;
    const pageSize = this.pageSizeSubject.value;

    this.rolesService.getRoles(filters, pageNumber, pageSize).subscribe({
      next: (data: Role[]) => {
        if (Array.isArray(data)) {
          this.rolesSubject.next(data);
        } else {
          this.rolesSubject.next([]);
        }
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
        this.isLoadingSubject.next(false);
        this.rolesSubject.next([]);
      },
      complete: () => {
        this.isLoadingSubject.next(false);
      }
    })
  }

  setEmployeesSubject(employees: Employee[]): void {
    console.log(employees);
    this.employeesSubject.next(employees);
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoading$;
  }

  setLoadingStatus(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  setAlphabetActiveState(active: boolean): void {
    this.alphabetActiveSubject.next(active);
  }

  getSelectedEmployeesFilters(): SelectedEmployeesFilter {
    return this.selectedEmployeesFiltersSubject.value;
  }

  setSelectedEmployeesFilters(filters: SelectedEmployeesFilter): void {
    this.selectedEmployeesFiltersSubject.next(filters);
  }

  getSelectedRolesFilters(): SelectedRolesFilter {
    return this.selectedRolesFiltersSubject.value;
  }

  setSelectedRolesFilters(filters: SelectedRolesFilter): void {
    this.selectedRolesFiltersSubject.next(filters);
  }

  setBtnResetState(state: boolean): void {
    this.btnResetStateSubject.next(state);
  }

  getBtnResetState(): boolean {
    return this.btnResetStateSubject.value;
  }

  setBtnApplyState(state: boolean): void {
    this.btnApplyStateSubject.next(state);
  }

  getBtnApplyState(): boolean {
    return this.btnApplyStateSubject.value;
  }

  setPageNumber(pageNumber: number): void {
    this.pageNumberSubject.next(pageNumber);
  }

  setPageSize(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
  }

  getPageNumber(): number {
    return this.pageNumberSubject.value;
  }

  getPageSize(): number {
    return this.pageSizeSubject.value;
  }

  resetPagination(): void {
    this.pageNumberSubject.next(this.DEFAULT_PAGE_NUMBER);
    this.pageSizeSubject.next(this.DEFAULT_PAGE_SIZE);
  }

  updateButtonStates(selectedFilters: SelectedEmployeesFilter | SelectedRolesFilter): boolean {
    const shouldDisable = this.disableButtons(selectedFilters);
    this.setBtnResetState(shouldDisable);
    this.setBtnApplyState(shouldDisable);
    return shouldDisable;
  }

  disableButtons(selectedFilters: SelectedEmployeesFilter | SelectedRolesFilter): boolean {
    if (this.isEmployeeFilter(selectedFilters)) {
      return (
        selectedFilters.alphabet.length === 0 &&
        selectedFilters.status.length === 0 &&
        selectedFilters.location.length === 0 &&
        selectedFilters.department.length === 0
      );
    }
    else {
      return (
        selectedFilters.department.length === 0
      );
    }

  }

  resetEmployeesFilters(): void {
    this.selectedEmployeesFiltersSubject.next(createDefaultSelectedEmployeesFilter());
  }

  resetRolesFilters(): void {
    this.selectedRolesFiltersSubject.next(createDefaultSelectedRolesFilter());
  }

  triggerAlphabetReset(): void {
    this.resetAlphabetButtonsSubject.next(true);
  }

  private isEmployeeFilter(filters: any): filters is SelectedEmployeesFilter {
    return 'status' in filters && 'location' in filters && 'department' in filters;
  }

  private isRoleFilter(filters: any): filters is SelectedRolesFilter {
    return !('status' in filters);
  }
}
