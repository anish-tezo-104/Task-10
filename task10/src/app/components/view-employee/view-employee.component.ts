import { Component, Input, Pipe } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import { SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { CommonModule, DatePipe } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css', '../../pages/home/home.component.css']
})
export class ViewEmployeeComponent {
  employeeId: number | null = null;
  employee: any = null;
  imagePreview: any = '../assets/default-user.png'
  isDataFetched: boolean = false;

  constructor(private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private toast: ToasterService) { 
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      if (this.employeeId) {
        this.loadEmployeeDetails();
      }
    });
  }
  
  loadEmployeeDetails() {
    if (this.employeeId !== null) {
      this.employeesService.getEmployeeById(this.employeeId).subscribe({
        next: (data) => {
          this.employee = data;
          this.imagePreview = data.profileImageData ? 'data:image/png;base64,' + data.profileImageData : this.imagePreview;
        },
        error: (err) => {
          this.toast.showErrorToaster(err);
        },
        complete: () => {
          this.isDataFetched = true;
        }
      });
    }
  }
}
