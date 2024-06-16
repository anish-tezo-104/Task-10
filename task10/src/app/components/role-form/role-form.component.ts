import { Component, OnInit } from '@angular/core';
import { Dropdown } from '../../models/dropdown';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms'; 
import { MobileNumberValidationDirective } from '../../directives/mobile-number-validation.directive';
import {  Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { ToasterService } from '../../services/toaster.service';
import { ErrorCodes } from '../../enums/error-codes';
import { SuccessCodes } from '../../enums/success-codes';


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
    private router: Router,
    private roleService: RolesService,
    private toast: ToasterService
  ) {

    this.roleForm = new FormGroup({
      roleName: new FormControl('', [Validators.required]),
      departmentId: new FormControl(null, [Validators.required]),
      description: new FormControl('', [Validators.maxLength(200)]),
      locationId : new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.locationOptions = JSON.parse(localStorage.getItem('locationOptions') || '[]');
    this.departmentOptions = JSON.parse(localStorage.getItem('departmentOptions') || '[]');
  }

  handleRoleFormSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.getRawValue();
      this.roleService.addRole(roleData).subscribe({
        next: () => {
          this.roleForm.reset();
        },
        error: (err) => {
          this.toast.showErrorToaster(err);
        },
        complete: () => {
          this.toast.showSuccessToaster(`${SuccessCodes.ADD_ROLE_SUCCESS}`);
          this.router.navigate(['/Roles']);
        }
      })
    } else {
      this.toast.showWarningToaster("Invalid Details!");
    }
  }

  validForm(): boolean {
    return this.roleForm.valid;
  }
}
