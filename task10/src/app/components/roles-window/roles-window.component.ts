import { Component, inject } from '@angular/core';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { ROLE_FILTER_CONFIG } from '../../config/role-filter.config';
import { Dropdown } from '../../models/dropdown';
import { LocalStorageServiceService } from '../../services/local-storage-service.service';
import { SharedService } from '../../services/shared.service';
import { RoleCardComponent } from '../role-card/role-card.component';
import { Role } from '../../models/role';
import { createDefaultSelectedRolesFilter, SelectedRolesFilter } from '../../models/selected-roles-filter';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roles-window',
  standalone: true,
  imports: [FilterBarComponent, RoleCardComponent, CommonModule, RouterModule],
  templateUrl: './roles-window.component.html',
  styleUrls: ['./roles-window.component.css', '../../app.component.css', '../filter-bar/filter-bar.component.css']
})
export class RolesWindowComponent {

  locationOptions: Dropdown[] = [];
  departmentOptions: Dropdown[] = [];
  rolesList: Role[] = [];
  isLoading: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 6;

  filterConfig = ROLE_FILTER_CONFIG;
  selectedRolesFilters: SelectedRolesFilter = createDefaultSelectedRolesFilter();

  sharedService = inject(SharedService);
  roleService = inject(RolesService);
  localStorageService = inject(LocalStorageServiceService);


  ngOnInit(): void {
    this.locationOptions = this.localStorageService.getItem('locationOptions');
    this.departmentOptions = this.localStorageService.getItem('departmentOptions');

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

    this.sharedService.loadRoles();
    this.sharedService.getRolesList().subscribe({
      next: (data: Role[]) => {
        this.rolesList = data;
      },
      error: (err) => {
        console.log('Error fetching roles:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
    this.sharedService.selectedRolesFilters$.subscribe(filters => {
      this.selectedRolesFilters = filters;

    });

    this.sharedService.getLoadingStatus().subscribe({
      next: (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    });
  }

  changePage(pageNumber: number): void {
    this.sharedService.setPageNumber(pageNumber);
    this.sharedService.loadRoles(this.selectedRolesFilters);
  }

  changePageSize(event: Event): void {
    const pageSize = (event.target as HTMLSelectElement).value;
    this.sharedService.setPageSize(Number(pageSize));
    this.sharedService.loadRoles(this.selectedRolesFilters);
  }

}