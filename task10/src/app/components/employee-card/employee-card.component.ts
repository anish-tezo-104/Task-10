import { Component, Input } from '@angular/core';
import { Employee } from '../../models/employee';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;

  getProfileImage(employee: Employee): string {
    return employee.profileImageData ? 'data:image/jpeg;base64,' + employee.profileImageData : "../../../assets/default-user.png";
  }
}
