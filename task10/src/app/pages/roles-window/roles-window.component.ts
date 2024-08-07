import { Component, inject } from '@angular/core';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { ROLE_FILTER_CONFIG } from '../../config/role-filter.config';
import { Dropdown } from '../../models/dropdown';
import { SharedService } from '../../services/shared.service';
import { RoleCardComponent } from '../../components/role-card/role-card.component';
import { Role } from '../../models/role';
import { createDefaultSelectedRolesFilter, SelectedRolesFilter } from '../../models/selected-roles-filter';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-roles-window',
  standalone: true,
  imports: [FilterBarComponent, RoleCardComponent, CommonModule, RouterModule],
  templateUrl: './roles-window.component.html',
  styleUrls: ['./roles-window.component.css',  '../home/home.component.css']
})
export class RolesWindowComponent {

  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];
  rolesList: Role[] = [];
  isRolesFetched: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 6;

  filterConfig = ROLE_FILTER_CONFIG;
  selectedRolesFilters: SelectedRolesFilter = createDefaultSelectedRolesFilter();

  sharedService = inject(SharedService);
  roleService = inject(RolesService);
  toast = inject(ToasterService);
  
  ngOnInit(): void {
    this.isRolesFetched = false;
    this.locationOptions = JSON.parse(localStorage.getItem('locationOptions') || '[]');
    this.departmentOptions = JSON.parse(localStorage.getItem('departmentOptions') || '[]');

    this.filterConfig[0].options = this.departmentOptions;
    this.filterConfig[1].options = this.locationOptions;

    this.sharedService.setPageNumber(this.pageNumber);
    this.sharedService.setPageSize(this.pageSize);

    this.sharedService.pageNumber$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;

    });

    this.sharedService.pageSize$.subscribe(pageSize => {
      this.pageSize = pageSize;
    });

    this.sharedService.selectedRolesFilters$.subscribe(filters => {
      this.selectedRolesFilters = filters;
    });
    
    this.sharedService.loadRoles();
    this.sharedService.roles$.subscribe({
      next: (data) => {
        this.rolesList = data;
      },
      error: () => {
        
      },
      complete: () => {
        this.isRolesFetched = true;
      }
    });
  }

  changePage(pageNumber: number): void {
    this.sharedService.setPageNumber(pageNumber);
    this.sharedService.loadRoles(this.selectedRolesFilters);
    this.isRolesFetched = true;
  }

  changePageSize(event: Event): void {
    const pageSize = (event.target as HTMLSelectElement).value;
    this.sharedService.setPageSize(Number(pageSize));
    this.sharedService.loadRoles(this.selectedRolesFilters)
    this.isRolesFetched = true;
  }

}