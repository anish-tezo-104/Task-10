import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { DropdownsService } from '../../services/dropdowns.service';
import { Dropdown } from '../../models/dropdown';
import { Role } from '../../models/role';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ToasterService } from '../../services/toaster.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, RouterLinkActive, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../app.component.css', '../../../styles.css']
})


export class HomeComponent {


  departmentOptions: Dropdown[] = [];
  statusOptions: Dropdown[] = [];
  locationOptions: Dropdown[] = [];
  rolesOptions: Role[] = [];
  isLoginRoute: boolean = false;

  @ViewChild('gridContainer') gridContainer!: ElementRef<HTMLDivElement>;
  gridContainerRef!: HTMLDivElement;

  @Output() gridContainerRefEmitter: EventEmitter<HTMLDivElement> = new EventEmitter();


  constructor(
    private cdref: ChangeDetectorRef,
    public dropdownsService: DropdownsService,
    public authService: AuthService,
    public toast: ToasterService,
    public router: Router
  ) { }

  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  ngOnInit() {
    this.cdref.detectChanges();
    if (this.authService.isAuthenticated()) {
      this.loadDepartmentDropdown();
      this.loadStatusDropdown();
      this.loadLocationDropdown();
      this.loadRolesDropdown();
    }
    else
    {
      this.toast.showErrorToaster('Unauthorized! Please Login');
      this.router.navigate(['/Login'])
    }
    
  }
  ngAfterViewInit() {
    this.gridContainerRef = this.gridContainer.nativeElement;
    this.gridContainerRefEmitter.emit(this.gridContainerRef);
  }


  loadDepartmentDropdown(): void {
    this.dropdownsService.getDepartmentList().subscribe({
      next: (data: Dropdown[]) => {
        this.departmentOptions = data;
        localStorage.setItem('departmentOptions', JSON.stringify(this.departmentOptions));
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
      }
    });
  }

  loadRolesDropdown(): void {
    this.dropdownsService.getRolesList().subscribe({
      next: (data: Role[]) => {
        this.rolesOptions = data;
        localStorage.setItem('rolesOptions', JSON.stringify(this.rolesOptions));
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
      }
    });
  }

  loadStatusDropdown(): void {
    this.statusOptions = [
      { id: 1, name: 'Active' },
      { id: 0, name: 'Inactive' }
    ];
    localStorage.setItem('statusOptions', JSON.stringify(this.statusOptions));
  }

  loadLocationDropdown(): void {
    this.dropdownsService.getLocationList().subscribe({
      next: (data: Dropdown[]) => {
        this.locationOptions = data;
        localStorage.setItem('locationOptions', JSON.stringify(this.locationOptions));
      },
      error: (err) => {
        this.toast.showErrorToaster(err);
      }
    });
  }
}
