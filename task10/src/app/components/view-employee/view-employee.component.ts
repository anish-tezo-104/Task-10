import { Component, Input, Pipe } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import {  SelectedEmployeesFilter } from '../../models/selected-employees-filter';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  employeeId: number | null = null;
  employee: any = null;

  constructor(private route: ActivatedRoute, private employeesService: EmployeesService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.loadEmployeeDetails();
    });
  }

  loadEmployeeDetails() {
    if (this.employeeId !== null) {

      this.employeesService.getEmployeeById(this.employeeId).subscribe({
        next: (data) => {
          console.log(data);
          this.employee = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
