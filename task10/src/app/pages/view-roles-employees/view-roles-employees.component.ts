import { Component } from '@angular/core';
import { Role } from '../../models/role';
import { Employee } from '../../models/employee';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import { RolesService } from '../../services/roles.service';
import { ToasterService } from '../../services/toaster.service';
import { EmployeeCardComponent } from '../../components/employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-view-roles-employees',
  standalone: true,
  imports: [EmployeeCardComponent, CommonModule, RouterModule],
  templateUrl: './view-roles-employees.component.html',
  styleUrls: ['./view-roles-employees.component.css', '../home/home.component.css']
})
export class ViewRolesEmployeesComponent {

  role: Role | undefined = undefined
  employees: Employee[] = [];
  roleId?: number;
  pageNumber: number = 1;
  pageSize: number = 6;
  isEmployeesFetched: boolean = false;
  isRoleFetched: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeesService,
    private rolesService: RolesService,
    private toast: ToasterService,
    private sharedService: SharedService) {

  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.roleId = params['roleId'];
      if (this.roleId) {
        this.fetchRole(this.roleId);
        this.fetchEmployees(this.roleId);
      }
    });

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;

    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });
  }

  changePage(pageNumber: number): void {
    this.sharedService.setPageNumber(pageNumber);
  }


  changePageSize(event: Event): void {
    const pageSize = (event.target as HTMLSelectElement).value;
    this.sharedService.setPageSize(Number(pageSize));

  }

  fetchRole(roleId: number): void {
    this.rolesService.getRoleById(roleId).subscribe({
      next: roleData => {
        this.role = roleData[0];
      },
      error: (err) => {
        this.toast.showErrorToaster(err)
      },
      complete: () => {
        this.isRoleFetched = true;
      }
    });
  }

  fetchEmployees(roleId: number): void {
    this.employeeService.getEmployeesByRoleId(roleId).subscribe({
      next: employeesData => {
        this.employees = employeesData;
      },
      error: (err) => {
        this.toast.showErrorToaster(err)
      },
      complete: () => {
        this.isEmployeesFetched = true;
      }
    });
  }

}
