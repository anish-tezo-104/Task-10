import { Component, OnInit } from '@angular/core';
import { Dropdown } from '../../models/dropdown';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../models/role';
import { DropdownsService } from '../../services/dropdowns.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormGroup and FormControl
import { EmployeesService } from '../../services/employees.service';
import { MobileNumberValidationDirective } from '../../directives/mobile-number-validation.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEmployee } from '../../models/edit-employee';
import { RolesService } from '../../services/roles.service';


@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MobileNumberValidationDirective,],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css'
})
export class RoleFormComponent implements OnInit {
  roleForm: FormGroup;
  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];

  constructor(
    private localStorageService: LocalStorageServiceService,
    private dropdownsService: DropdownsService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RolesService
  ) {

    this.roleForm = new FormGroup({
      roleName: new FormControl('', [Validators.required]),
      departmentId: new FormControl(null, [Validators.required]),
      // description: new FormControl('', [Validators.required]),
      locationId : new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.locationOptions = this.localStorageService.getItem('locationOptions');
    this.departmentOptions = this.localStorageService.getItem('departmentOptions');
  }

  handleRoleFormSubmit(): void {
    if (this.roleForm.valid) {

      const roleData = this.roleForm.getRawValue();
      this.roleService.addRole(roleData).subscribe({
        next: () => {
          this.roleForm.reset();
          
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.router.navigate(['/Roles']);
        }
      })
    } else {
      console.log("Form is invalid");
    }
  }

  validForm(): boolean {
    return this.roleForm.valid;
  }
}
