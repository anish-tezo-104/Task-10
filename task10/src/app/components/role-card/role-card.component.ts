import { Component, Input } from '@angular/core';
import { Role } from '../../models/role';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-card.component.html',
  styleUrl: './role-card.component.css'
})
export class RoleCardComponent {

  @Input() role!: Role;

  openRoleDescription(): void {
    console.log("View Employees");
  }
}
