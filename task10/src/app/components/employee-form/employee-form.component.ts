import { Component, OnInit } from '@angular/core';
import { Dropdown } from '../../models/dropdown';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../models/role';
import { DropdownsService } from '../../services/dropdowns.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { MobileNumberValidationDirective } from '../../directives/mobile-number-validation.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEmployee } from '../../models/edit-employee';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MobileNumberValidationDirective,],
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
  employeeId: number | null = null;
  editEmployee: any = null;
  selectedFile: any | null = null;
  formData: FormData;
  imagePreview: string | ArrayBuffer | null = '../assets/default-user.png'

  constructor(
    private localStorageService: LocalStorageServiceService,
    private dropdownsService: DropdownsService,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router
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

    this.rolesOptions = this.localStorageService.getItem('rolesOptions');
    this.locationOptions = this.localStorageService.getItem('locationOptions');
    this.departmentOptions = this.localStorageService.getItem('departmentOptions'); this.loadManagersList();
    this.loadProjectsList();

    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      if (this.employeeId) {
        this.showEditPage = true;
        this.employeeForm.controls['uid'].disable();
        this.editEmployees(this.employeeId);
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
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
        this.employeeForm.patchValue(data);
        this.editEmployee = data;
        this.departmentSelected = true;
        this.employeeForm.controls['roleId'].enable();
        this.filterRolesByDepartment(data.departmentId);
      },
      error: (err) => {
        console.log(err);
      },
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
      this.employeesService.editEmployee(this.employeeId!, editedData, this.selectedFile).subscribe({
        next: () => {
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.onCancelForm();
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
          this.onCancelForm();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.imagePreview = "../assets/default-user.png";
        }
      });
    }
    else {
      console.log("Form is invalid");
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
    console.log(this.filteredRolesOptions, departmentId)
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
  }
}