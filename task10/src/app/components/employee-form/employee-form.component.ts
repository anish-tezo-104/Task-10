import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dropdown } from '../../models/dropdown';
import { CommonModule } from '@angular/common';
import { Role } from '../../models/role';
import { DropdownsService } from '../../services/dropdowns.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { MobileNumberValidationDirective } from '../../directives/mobile-number-validation.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { ErrorCodes } from '../../enums/error-codes';
import { SuccessCodes } from '../../enums/success-codes';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MobileNumberValidationDirective],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  showEditPage: boolean = false;
  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];
  rolesOptions: Role[] = [];
  filteredRolesOptions: Role[] = [];
  managerOptions: Dropdown[] = [];
  projectOptions: Dropdown[] = [];
  employeeForm: FormGroup;
  departmentSelected: boolean = false;
  newFileSelected: boolean = false;
  employeeId: number | null = null;
  editEmployee: any = null;
  selectedFile: any | null = null;
  formData: FormData;
  imagePreview: any = '../assets/default-user.png'
  isDataFetched: boolean = false;


  constructor(
    private dropdownsService: DropdownsService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToasterService
  ) {

    this.formData = new FormData();

    this.employeeForm = new FormGroup({
      uid: new FormControl('', [Validators.required, Validators.pattern(/^TZ\d{4}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      mobileNumber: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      joiningDate: new FormControl('', [Validators.required]),
      locationId: new FormControl(null),
      roleId: new FormControl({ value: null, disabled: true }),
      departmentId: new FormControl(null),
      managerId: new FormControl(null),
      projectId: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.rolesOptions = JSON.parse(localStorage.getItem('rolesOptions') || '[]');
    this.locationOptions = JSON.parse(localStorage.getItem('locationOptions') || '[]');
    this.departmentOptions = JSON.parse(localStorage.getItem('departmentOptions') || '[]');

    this.loadManagersList();
    this.loadProjectsList();

    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      if (this.employeeId) {
        this.editEmployees(this.employeeId);
        this.showEditPage = true;
        this.employeeForm.controls['uid'].disable();
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.newFileSelected = true;
      // Update image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(this.selectedFile!);
    }
  }

  editEmployees(employeeId: number): void {
    this.employeesService.getEmployeeById(employeeId).subscribe({
      next: (data) => {

        if (data.joiningDate) {
          data.joiningDate = new Date(data.joiningDate).toISOString().substring(0, 10);
        }

        if (data.dob) {
          data.dob = new Date(data.dob).toISOString().substring(0, 10);
        }

        if (data.managerId == null) {
          data.managerId = null;
        }

        this.editEmployee = data;
        this.employeeForm.patchValue(data);
        this.departmentSelected = true;
        this.employeeForm.controls['roleId'].enable();
        this.filterRolesByDepartment(data.departmentId);
        this.imagePreview = data.profileImageData ? 'data:image/jpeg;base64,' + data.profileImageData : this.imagePreview;
        this.selectedFile = null;
        this.newFileSelected = false;
      },
      error: () => {
        this.toast.showErrorToaster(ErrorCodes.FAILED_TO_FETCH_EMPLOYEE);
      },
      complete: () => {
        this.isDataFetched = true;
      }
    });
  }

  loadManagersList(): void {
    this.dropdownsService.getManagersList().subscribe(data => {
      this.managerOptions = data;
    });
  }

  loadProjectsList(): void {
    this.dropdownsService.getProjectsList().subscribe(data => {
      this.projectOptions = data;
    });
  }


  handleEmployeeFormSubmit(): void {
    const employeeData = this.employeeForm.getRawValue();
    if (this.showEditPage && this.employeeId) {
      this.handleEditEmployee(employeeData);

    } else {
      this.handleAddEmployee(employeeData);
    }

  }

  validForm(): boolean {
    return this.employeeForm.valid;
  }

  onDepartmentChange(event: any): void {
    const departmentId = parseInt(event.target.value);
    if (departmentId) {
      this.departmentSelected = true;
      this.employeeForm.controls['roleId'].enable();
      this.filterRolesByDepartment(departmentId);
    } else {
      this.departmentSelected = false;
      this.employeeForm.controls['roleId'].disable();
      this.filteredRolesOptions = [];
    }
  }

  filterRolesByDepartment(departmentId: number): void {

    this.filteredRolesOptions = this.rolesOptions.filter(role => role.departmentId === departmentId);
    if (this.filteredRolesOptions.length === 0) {
      this.departmentSelected = false;
      this.employeeForm.controls['roleId'].setValue(null);
    }
  }

  onCancelForm(): void {
    this.employeeForm.reset();
    this.employeeForm.controls['roleId'].disable();
    this.departmentSelected = false;
    this.filteredRolesOptions = [];
    this.newFileSelected = false;
  }

  private handleEditEmployee(employeeData: any): void {
    const editedData: any = {};
    for (const key in employeeData) {
      if (
        employeeData.hasOwnProperty(key) &&
        (employeeData[key] !== null && employeeData[key] !== this.editEmployee[key])
      ) {
        editedData[key] = employeeData[key];
      }
    }

    if (Object.keys(editedData).length > 0 || this.selectedFile) {
      this.employeesService.editEmployee(this.employeeId!, this.editEmployee, editedData, this.selectedFile).subscribe({
        next: () => { },
        error: (err) => {
          this.toast.showErrorToaster(err);
        },
        complete: () => {
          this.onCancelForm();
          this.toast.showSuccessToaster(SuccessCodes.EDIT_EMPLOYEE_SUCCESS);
          this.router.navigate(['/Employees']);
          this.imagePreview = "../assets/default-user.png";
        }
      });
    } else {
      this.onCancelForm();
    }
  }

  private handleAddEmployee(employeeData: any): void {
    if (this.employeeForm.valid) {
      this.employeesService.addEmployee(employeeData, this.selectedFile).subscribe({
        next: () => {

        },
        error: (err) => {
          this.toast.showErrorToaster(err);
        },
        complete: () => {
          this.toast.showSuccessToaster(ErrorCodes.EMPLOYEE_ADDED_SUCCESS);
          this.onCancelForm();
          this.router.navigate(['/Employees']);
          this.imagePreview = "../assets/default-user.png";
        }
      });
    }
    else {
      this.toast.showWarningToaster(ErrorCodes.FORM_INVALID, ErrorCodes.TRY_AGAIN);
    }
  }
}