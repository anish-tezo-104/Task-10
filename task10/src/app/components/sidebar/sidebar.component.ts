import { Component, ElementRef, inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Dropdown } from '../../models/dropdown';
import { Employee } from '../../models/employee';
import { DepartmentEmployeeGroup } from '../../models/department-employee-group';
import { Router, RouterModule } from '@angular/router';

import { ToasterService } from '../../services/toaster.service';
import { EmployeesService } from '../../services/employees.service';
import { ErrorCodes } from '../../enums/error-codes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../header/header.component.css', '../../pages/home/home.component.css']
})
export class SidebarComponent implements OnInit {
  departments: Dropdown[] = [];
  employees: Employee[] = [];
  employeesGroupedByDepartment: DepartmentEmployeeGroup[] = [];
  isSidebarActive: boolean = false;
  sectionStates: { [key: string]: boolean } = {
    roles: false,
    assignUser: false
  };
  

  constructor(private sharedService: SharedService, private router: Router, private employeesService: EmployeesService) { }
  toast = inject(ToasterService);

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('sidebarHandleIcon') sidebarHandleIcon!: ElementRef;
  @ViewChild('sidebarRolesIcon') sidebarRolesIcon!: ElementRef;
  @ViewChild('sidebarAssignUserIcon') sidebarAssignUserIcon!: ElementRef;
  @ViewChild('dropdownContentHeader', { static: false }) dropdownContentHeader!: ElementRef;
  @ViewChild('departmentsList') departmentsList!: ElementRef;
  @ViewChild('employeeForm') employeeForm!: ElementRef;
  @ViewChildren('subSec') subSec!: QueryList<ElementRef>;

  @Input() gridContainerRef!: any;

  ngOnInit() {
    this.departments = JSON.parse(localStorage.getItem('departmentOptions') || '[]');

    this.sharedService.loadEmployeesGroupedByDepartment();
    this.sharedService.employeesGroupedByDepartment$.subscribe(data => {
      this.employeesGroupedByDepartment = data;
    });
  }

  getDepartmentNameById(departmentId: number): string | null {
    const departmentsJson = localStorage.getItem('departmentOptions');
    if (departmentsJson) {
      const departments: Dropdown[] = JSON.parse(departmentsJson);
      const department = departments.find(dept => dept.id === departmentId);
      if (department) {
        return department.name;
      }
    }
    return null;
  }

  toggleSideBar(): void {
    if (this.sidebar && this.gridContainerRef && this.sidebarHandleIcon) {
      const sideBar = this.sidebar.nativeElement;
      const gridContainer: HTMLElement = this.gridContainerRef;
      const sidebarHandleIcon = this.sidebarHandleIcon.nativeElement;
      const sidebarRolesIcon = this.sidebarRolesIcon.nativeElement;
      const sidebarAssignUserIcon = this.sidebarAssignUserIcon.nativeElement;

      if (sideBar.classList.contains("active")) {
        sideBar.classList.remove("active");
        gridContainer.style.gridTemplateColumns = "6% 94%";
        sidebarRolesIcon.style.paddingLeft = "0.5rem";
        sidebarAssignUserIcon.style.paddingLeft = "0.5rem";
        sidebarHandleIcon.style.transform = "rotate(-180deg)";
      } else {
        sideBar.classList.add("active");
        gridContainer.style.gridTemplateColumns = "20% 80%";
        sidebarRolesIcon.style.paddingLeft = "1rem";
        sidebarAssignUserIcon.style.paddingLeft = "1rem";
        sidebarHandleIcon.style.transform = "rotate(360deg)";
      }
    }
  }

  toggleSubSecClass(event: Event, section: string): void {
    const element = event.currentTarget as HTMLElement;
    this.sectionStates[section] = !this.sectionStates[section];
    if (element.classList.contains("unlocked")) {
      if (element.classList.contains("active")) {
        element.classList.remove("active");
        // this.globalUtilityFunctions.resetFormProfileImage();
        this.router.navigate(['/']);
        this.hideShowDepartmentListSidebar(false);
      } else {

        if (element.classList.contains("employees")) {
          this.hideShowDepartmentListSidebar(true);
        }
        else {
          this.hideShowDepartmentListSidebar(false);
        }

        if (window.innerWidth <= 900) {
          var sideBar = this.sidebar.nativeElement;
          if (sideBar.classList.contains("active")) {
            this.toggleSideBar();
          }
        }

        this.subSec.forEach((subSec) => {
          subSec.nativeElement.classList.remove("active");
        });
        element.classList.add("active");
      }
    }
  }

  sortByDept(id: number): void {
    this.employeesService.getEmployeesByDeptId(id).subscribe({
      next: (employees: Employee[]) => {
        this.sharedService.setEmployeesSubject(employees); 
      },
      error: () => {
        this.toast.showErrorToaster(ErrorCodes.FILTERING_ERROR);
      }
    });
  }

  hideShowDepartmentListSidebar(check: boolean): void {
    const departmentsListDiv = this.departmentsList.nativeElement as HTMLElement;
    if (departmentsListDiv) {
      if (check) {
        departmentsListDiv.classList.add("active");
      }
      else {
        departmentsListDiv.classList.remove("active");
      }
    }
  }

  handleUpdateDismiss(): void {
    var updateContainer = document.querySelector(
      ".update-message"
    ) as HTMLElement;
    updateContainer.classList.remove("active");
  }

}
