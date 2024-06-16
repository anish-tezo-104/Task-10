import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { SuccessCodes } from '../../enums/success-codes';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TitleCasePipe, CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../pages/home/home.component.css']
})
export class HeaderComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('sidebarHandleIcon') sidebarHandleIcon!: ElementRef;
  @ViewChild('sidebarRolesIcon') sidebarRolesIcon!: ElementRef;
  @ViewChild('sidebarAssignUserIcon') sidebarAssignUserIcon!: ElementRef;
  @ViewChild('dropdownContentHeader', { static: false })
  dropdownContentRef!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  loggedUser: any = null;
  profilePicture: any = '../assets/default-user.png';
  showDropdown = false;
  searchKeyword: string = '';


  constructor(private sharedService: SharedService,
    private router: Router,
    private toast: ToasterService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem("authUser") || '[]');
    this.profilePicture = this.loggedUser.profileImageData ? 'data:image/jpeg;base64,' + this.loggedUser.profileImageData : this.profilePicture;
  }

  logout() {
    this.sharedService.logout(this.loggedUser.id);
  }


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleSideBar(): void {
    if (this.sidebar && this.gridContainer && this.sidebarHandleIcon) {
      const sideBar = this.sidebar.nativeElement;
      const gridContainer = this.gridContainer.nativeElement;
      if (sideBar.classList.contains("active")) {
        sideBar.classList.remove("active");
        gridContainer.style.gridTemplateColumns = "6% 94%";
        this.updateIconPadding('0.5rem');
        this.sidebarHandleIcon.nativeElement.style.transform = "rotate(-180deg)";
      } else {
        sideBar.classList.add("active");
        gridContainer.style.gridTemplateColumns = "20% 80%";
        this.updateIconPadding('1rem');
        this.sidebarHandleIcon.nativeElement.style.transform = "rotate(360deg)";
      }
    }
  }

  handleInput(): void {
    if (!this.searchKeyword.trim()) {
      this.sharedService.loadEmployees();
    }
  }

  handleSearch(): void {
    const searchKeyword = this.searchKeyword.trim();
    if (searchKeyword) {
      if (window.location.pathname === "/Employees") {
        this.sharedService.searchEmployees(searchKeyword);
      }
      if (window.location.pathname === "/Roles") {
        this.sharedService.searchRoles(searchKeyword);
      }

    }
  }

  private updateIconPadding(padding: string): void {
    if (this.sidebarRolesIcon) this.sidebarRolesIcon.nativeElement.style.paddingLeft = padding;
    if (this.sidebarAssignUserIcon) this.sidebarAssignUserIcon.nativeElement.style.paddingLeft = padding;
  }

  handleBurger(): void {
    if (this.dropdownContentRef) {
      const dropdownContent = this.dropdownContentRef.nativeElement as HTMLElement;
      if (dropdownContent.classList.contains("active")) {
        dropdownContent.classList.remove("active");
      } else {
        dropdownContent.classList.add("active");
      }
    }
  }
}