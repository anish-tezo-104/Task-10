import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DropdownsService } from './services/dropdowns.service';
import { Dropdown } from './models/dropdown';
import { LocalStorageServiceService } from './services/local-storage-service.service';
import { Role } from './models/role';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css']
})

export class AppComponent {
  departmentOptions: Dropdown[] = [];
  statusOptions: Dropdown[] = [];
  locationOptions: Dropdown[] = [];
  rolesOptions: Role[] = [];
  isLoginRoute: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private localStorageService: LocalStorageServiceService, public dropdownsService: DropdownsService) { }

  @ViewChild('gridContainer') gridContainer!: ElementRef<HTMLDivElement>;
  gridContainerRef!: HTMLDivElement;

  @Output() gridContainerRefEmitter: EventEmitter<HTMLDivElement> = new EventEmitter();

  ngOnInit() {

    if (window.location.pathname === '/') {
      this.isLoginRoute = true;
    }

    this.loadDepartmentDropdown();
    this.loadStatusDropdown();
    this.loadLocationDropdown();
    this.loadRolesDropdown();
  }
  ngAfterViewInit() {
    this.gridContainerRef = this.gridContainer.nativeElement;
    this.gridContainerRefEmitter.emit(this.gridContainerRef);
    // Trigger change detection
    this.cdr.detectChanges();
  }

  loadDepartmentDropdown(): void {
    this.dropdownsService.getDepartmentList().subscribe({
      next: (data: Dropdown[]) => {
        this.departmentOptions = data;
        this.localStorageService.setItem('departmentOptions', this.departmentOptions);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadRolesDropdown(): void {
    this.dropdownsService.getRolesList().subscribe({
      next: (data: Role[]) => {
        this.rolesOptions = data;
        this.localStorageService.setItem('rolesOptions', this.rolesOptions);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadStatusDropdown(): void {
    this.statusOptions = [
      { id: 1, name: 'Active' },
      { id: 0, name: 'Inactive' }
    ];
    this.localStorageService.setItem('statusOptions', this.statusOptions);
  }

  loadLocationDropdown(): void {
    this.dropdownsService.getLocationList().subscribe({
      next: (data: Dropdown[]) => {
        this.locationOptions = data;
        this.localStorageService.setItem('locationOptions', this.locationOptions);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
